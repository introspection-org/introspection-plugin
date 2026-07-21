from __future__ import annotations

import json
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PUBLIC_WORKFLOWS = {"create", "deploy", "improve", "migrate"}
SUPPORTING_SKILLS = {"evals", "harbor", "introspection", "recipes"}
ALL_SKILLS = PUBLIC_WORKFLOWS | SUPPORTING_SKILLS
ONBOARDING_ENTRYPOINTS = {"scratch", "template", "migrate"}
ENTRYPOINT_SKILLS = {
    "scratch": "introspection:create",
    "template": "introspection:create",
    "migrate": "introspection:migrate",
}
CANONICAL_INSTALL_COMMANDS = {
    "codex": (
        "npx --yes plugins@latest add introspection-org/introspection-plugin "
        "--target codex --scope user --yes"
    ),
    "claude-code": (
        "npx --yes plugins@latest add introspection-org/introspection-plugin "
        "--target claude-code --scope user --yes"
    ),
}
SKILL_REFERENCE = re.compile(
    r"\$(?:recipes|evals|harbor|introspection)\b(?!:)"
)
MARKDOWN_LINK = re.compile(r"\[[^\]]+\]\(([^)]+)\)")


def fail(errors: list[str], message: str) -> None:
    errors.append(message)


def validate_skill_layout(errors: list[str]) -> None:
    skill_root = ROOT / "skills"
    discovered = {path.parent.name for path in skill_root.glob("*/SKILL.md")}
    if discovered != ALL_SKILLS:
        fail(
            errors,
            "Expected exactly these skills: "
            f"{sorted(ALL_SKILLS)}; discovered {sorted(discovered)}",
        )

    command_root = ROOT / "commands"
    if command_root.exists():
        duplicates = {
            path.stem for path in command_root.glob("*.md") if path.stem in discovered
        }
        if duplicates:
            fail(
                errors,
                "Legacy commands duplicate skill names: " + ", ".join(sorted(duplicates)),
            )


def validate_namespaced_references(errors: list[str]) -> None:
    for path in [*ROOT.glob("skills/**/*.md"), *ROOT.glob("skills/**/*.yaml")]:
        for line_number, line in enumerate(path.read_text().splitlines(), start=1):
            match = SKILL_REFERENCE.search(line)
            if match:
                fail(
                    errors,
                    f"{path.relative_to(ROOT)}:{line_number}: "
                    f"unqualified plugin skill reference {match.group(0)!r}",
                )


def validate_local_links(errors: list[str]) -> None:
    for path in ROOT.glob("skills/**/*.md"):
        for target in MARKDOWN_LINK.findall(path.read_text()):
            if target.startswith(("http://", "https://", "#", "mailto:")):
                continue
            resolved = (path.parent / target.split("#", maxsplit=1)[0]).resolve()
            if not resolved.exists():
                fail(
                    errors,
                    f"{path.relative_to(ROOT)}: missing local reference {target!r}",
                )


def validate_trigger_cases(errors: list[str]) -> None:
    path = ROOT / "tests" / "trigger-cases.json"
    try:
        cases = json.loads(path.read_text())
    except (OSError, json.JSONDecodeError) as exc:
        fail(errors, f"Unable to read trigger cases: {exc}")
        return

    if not isinstance(cases, list) or not cases:
        fail(errors, "Trigger cases must be a non-empty JSON list")
        return

    seen_ids: set[str] = set()
    positive_routes: set[str] = set()
    onboarding_entrypoints: set[str] = set()
    negative_count = 0
    for case in cases:
        if not isinstance(case, dict):
            fail(errors, "Every trigger case must be an object")
            continue
        case_id = case.get("id")
        prompt = case.get("prompt")
        expected = case.get("expected_skill")
        entrypoint = case.get("entrypoint")
        if not isinstance(case_id, str) or not case_id:
            fail(errors, "Every trigger case needs a non-empty id")
        elif case_id in seen_ids:
            fail(errors, f"Duplicate trigger case id: {case_id}")
        else:
            seen_ids.add(case_id)
        if not isinstance(prompt, str) or not prompt:
            fail(errors, f"Trigger case {case_id!r} needs a non-empty prompt")
        if expected is None:
            negative_count += 1
        elif expected not in {f"introspection:{name}" for name in ALL_SKILLS}:
            fail(errors, f"Trigger case {case_id!r} has unknown skill {expected!r}")
        else:
            positive_routes.add(expected)
        if entrypoint is not None:
            if entrypoint not in ONBOARDING_ENTRYPOINTS:
                fail(
                    errors,
                    f"Trigger case {case_id!r} has unknown entrypoint {entrypoint!r}",
                )
            else:
                onboarding_entrypoints.add(entrypoint)
                expected_route = ENTRYPOINT_SKILLS[entrypoint]
                if expected != expected_route:
                    fail(
                        errors,
                        f"Trigger case {case_id!r} maps entrypoint {entrypoint!r} "
                        f"to {expected!r}, expected {expected_route!r}",
                    )

    missing = {
        f"introspection:{name}" for name in PUBLIC_WORKFLOWS
    } - positive_routes
    if missing:
        fail(errors, "Missing positive trigger coverage for: " + ", ".join(sorted(missing)))
    if negative_count == 0:
        fail(errors, "At least one near-miss negative trigger case is required")
    missing_entrypoints = ONBOARDING_ENTRYPOINTS - onboarding_entrypoints
    if missing_entrypoints:
        fail(
            errors,
            "Missing onboarding trigger coverage for: "
            + ", ".join(sorted(missing_entrypoints)),
        )


def validate_hitl_contract(errors: list[str]) -> None:
    for name in PUBLIC_WORKFLOWS:
        body = (ROOT / "skills" / name / "SKILL.md").read_text()
        if "confirm" not in body.lower():
            fail(errors, f"{name}: execution brief does not request confirmation")

    combined = "\n".join(
        (ROOT / "skills" / name / "SKILL.md").read_text().lower()
        for name in (*PUBLIC_WORKFLOWS, "recipes", "introspection")
    )
    if "before the workflow needs the corresponding command" not in combined:
        fail(errors, "Skills do not enforce just-in-time tool setup")

    introspection = (ROOT / "skills" / "introspection" / "SKILL.md").read_text().lower()
    if "never use the dashboard, a browser, or browser automation" not in introspection:
        fail(errors, "Introspection skill does not enforce CLI-only operation")


def validate_onboarding_contract(errors: list[str]) -> None:
    readme = (ROOT / "README.md").read_text()
    for target, command in CANONICAL_INSTALL_COMMANDS.items():
        if command not in readme:
            fail(errors, f"README is missing canonical {target} install command")

    create = (ROOT / "skills" / "create" / "SKILL.md").read_text()
    if "from scratch or an existing recipe template" not in create:
        fail(errors, "create skill does not advertise scratch and template modes")

    codex = json.loads((ROOT / ".codex-plugin" / "plugin.json").read_text())
    claude = json.loads((ROOT / ".claude-plugin" / "plugin.json").read_text())
    marketplace = json.loads(
        (ROOT / ".claude-plugin" / "marketplace.json").read_text()
    )
    versions = {
        codex.get("version"),
        claude.get("version"),
        marketplace.get("plugins", [{}])[0].get("version"),
    }
    if len(versions) != 1 or None in versions:
        fail(errors, f"Plugin manifest versions disagree: {sorted(map(str, versions))}")


def main() -> int:
    errors: list[str] = []
    validate_skill_layout(errors)
    validate_namespaced_references(errors)
    validate_local_links(errors)
    validate_trigger_cases(errors)
    validate_hitl_contract(errors)
    validate_onboarding_contract(errors)
    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        return 1
    print("Plugin structure and behavioral contracts are valid.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
