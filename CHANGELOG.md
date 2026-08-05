# Changelog

## [0.6.0](https://github.com/introspection-org/introspection-plugin/compare/v0.5.0...v0.6.0) (2026-08-05)


### Features

* **hooks:** capture sessions as traces when the user opts in ([#38](https://github.com/introspection-org/introspection-plugin/issues/38)) ([f1c14cb](https://github.com/introspection-org/introspection-plugin/commit/f1c14cbc9b2383af836dd65937d5368ab4f87680))


### Bug Fixes

* **skills:** authorize unresolved first-runtime registration ([#36](https://github.com/introspection-org/introspection-plugin/issues/36)) ([aef447d](https://github.com/introspection-org/introspection-plugin/commit/aef447df279e396123d16f96c3bf15112cb7960d))

## [0.5.0](https://github.com/introspection-org/introspection-plugin/compare/v0.4.0...v0.5.0) (2026-08-03)


### ⚠ BREAKING CHANGES

* capabilities/ is removed. Content that referenced a capability module by relative path must resolve the equivalent key through the index.

### Code Refactoring

* replace capability modules with step-routed references, keep permission on disk ([#34](https://github.com/introspection-org/introspection-plugin/issues/34)) ([9f3c5ec](https://github.com/introspection-org/introspection-plugin/commit/9f3c5eca24dbd23e6f16f9707f61991f5018d8c0))

## [0.4.0](https://github.com/introspection-org/introspection-plugin/compare/v0.3.2...v0.4.0) (2026-08-01)


### Features

* **skills:** add the operate entry point, split the five by what a request ends in, and route organization work to the dashboard ([#32](https://github.com/introspection-org/introspection-plugin/issues/32)) ([f78c9aa](https://github.com/introspection-org/introspection-plugin/commit/f78c9aa28e890b98d317c6d11adf9714329fd0bc))


### Bug Fixes

* **skills:** correct claims about surfaces that do not exist ([#30](https://github.com/introspection-org/introspection-plugin/issues/30)) ([a66532f](https://github.com/introspection-org/introspection-plugin/commit/a66532f19fc429dfc4f9ede3dcf35984659c4f98))
* **skills:** route to pages instead of restating them, close the workflow lifecycle, and validate page keys ([#33](https://github.com/introspection-org/introspection-plugin/issues/33)) ([52549b0](https://github.com/introspection-org/introspection-plugin/commit/52549b0321e252a4cb18dac2c62135aa9135e1a1))

## [0.3.2](https://github.com/introspection-org/introspection-plugin/compare/v0.3.1...v0.3.2) (2026-07-31)


### Bug Fixes

* **skills:** bootstrap without confirmation ([#28](https://github.com/introspection-org/introspection-plugin/issues/28)) ([934492b](https://github.com/introspection-org/introspection-plugin/commit/934492b064fa925be98208f5e381e105aaa0c36a))

## [0.3.1](https://github.com/introspection-org/introspection-plugin/compare/v0.3.0...v0.3.1) (2026-07-31)


### Bug Fixes

* **skills:** align workflows with trajectory evidence ([#27](https://github.com/introspection-org/introspection-plugin/issues/27)) ([52ab49a](https://github.com/introspection-org/introspection-plugin/commit/52ab49aaef3095116ca44d8eac376e910cea04c0))
* **skills:** recover incompatible Node runtimes ([#25](https://github.com/introspection-org/introspection-plugin/issues/25)) ([d2d9e46](https://github.com/introspection-org/introspection-plugin/commit/d2d9e46ae2652673a4b2436db82376525dce12b5))

## [0.3.0](https://github.com/introspection-org/introspection-plugin/compare/v0.2.1...v0.3.0) (2026-07-29)


### Features

* **release:** publish stable plugin channel version ([#23](https://github.com/introspection-org/introspection-plugin/issues/23)) ([1f5c7cf](https://github.com/introspection-org/introspection-plugin/commit/1f5c7cfa455ebf5fc2d26a01b22beeadd3b44dd0))
* **skills:** streamline public workflows and runtime bootstrap ([#16](https://github.com/introspection-org/introspection-plugin/issues/16)) ([eb5ab05](https://github.com/introspection-org/introspection-plugin/commit/eb5ab0572381f0374446b67d0fad6fbce10a499b))


### Bug Fixes

* **skills:** share cloud resource links ([#20](https://github.com/introspection-org/introspection-plugin/issues/20)) ([c5062d9](https://github.com/introspection-org/introspection-plugin/commit/c5062d99a57b88b19da9967916ebf7ff41fa3034))

## [0.2.1](https://github.com/introspection-org/introspection-plugin/compare/v0.2.0...v0.2.1) (2026-07-28)


### Bug Fixes

* **skills:** allow repository setup before connector ([#17](https://github.com/introspection-org/introspection-plugin/issues/17)) ([5c01674](https://github.com/introspection-org/introspection-plugin/commit/5c01674b69f8478db38a1e049bd8b91423cfba7d))

## [0.2.0](https://github.com/introspection-org/introspection-plugin/compare/v0.1.0...v0.2.0) (2026-07-28)


### ⚠ BREAKING CHANGES

* **skills:** resolve all content through the reference index ([#11](https://github.com/introspection-org/introspection-plugin/issues/11))

### Features

* add template onboarding path ([#6](https://github.com/introspection-org/introspection-plugin/issues/6)) ([9f02bbc](https://github.com/introspection-org/introspection-plugin/commit/9f02bbc6a44f4ef5218682104c105c6f3a3285e7))
* **skills:** resolve all content through the reference index ([#11](https://github.com/introspection-org/introspection-plugin/issues/11)) ([9871296](https://github.com/introspection-org/introspection-plugin/commit/9871296166693ddf9cf6d371c4818aebe0b3e42a))
* **skills:** start every recipe from a catalog template and consolidate on the Introspection CLI ([#13](https://github.com/introspection-org/introspection-plugin/issues/13)) ([e0df1a4](https://github.com/introspection-org/introspection-plugin/commit/e0df1a48ca12afe16f8e2fc53b6f9480793ffe47))


### Bug Fixes

* **skills:** gate deployment on GitHub App access ([#15](https://github.com/introspection-org/introspection-plugin/issues/15)) ([25625ae](https://github.com/introspection-org/introspection-plugin/commit/25625ae27cc579df93599eda4063095b8a971efe))

## 0.1.0 (2026-07-20)

- Initial release.
