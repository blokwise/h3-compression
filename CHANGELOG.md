# Changelog


## v0.6.0

[compare changes](https://github.com/blokwise/h3-compression/compare/v0.5.3...v0.6.0)

### 🚀 Enhancements

- Rename buffer creator handler ([bb14c74](https://github.com/blokwise/h3-compression/commit/bb14c74))
- Add stream writer handler ([939d02d](https://github.com/blokwise/h3-compression/commit/939d02d))
- Add readable creator handler ([1f20421](https://github.com/blokwise/h3-compression/commit/1f20421))
- Extend options to enable configuring usage of different handler types and enable chunked transfer encoding by default ([bb960f9](https://github.com/blokwise/h3-compression/commit/bb960f9))
- Make useCompressionStream work with object-like data ([e051cfd](https://github.com/blokwise/h3-compression/commit/e051cfd))

### 💅 Refactors

- Remove console statements ([1760e88](https://github.com/blokwise/h3-compression/commit/1760e88))
- Include returnReadableStream in chunkedTransferEncoding option ([400c2ae](https://github.com/blokwise/h3-compression/commit/400c2ae))

### 📦 Build

- Explicitely add scule to deps ([6ba1f78](https://github.com/blokwise/h3-compression/commit/6ba1f78))
- Specify node engine ([4bcdb5f](https://github.com/blokwise/h3-compression/commit/4bcdb5f))

### 🏡 Chore

- Recreate lockfile ([6237818](https://github.com/blokwise/h3-compression/commit/6237818))
- Adjust lint-staged to only lint ts files ([d0d61e0](https://github.com/blokwise/h3-compression/commit/d0d61e0))
- Cleanup dev deps and bump vitest ([406ce58](https://github.com/blokwise/h3-compression/commit/406ce58))

### ✅ Tests

- Update vitest config ([3ef2d3a](https://github.com/blokwise/h3-compression/commit/3ef2d3a))
- Stub dist ([57dcdb6](https://github.com/blokwise/h3-compression/commit/57dcdb6))
- Add some test data ([f554bd0](https://github.com/blokwise/h3-compression/commit/f554bd0))
- Add test utils ([a812f16](https://github.com/blokwise/h3-compression/commit/a812f16))
- Add tests ([ca206ac](https://github.com/blokwise/h3-compression/commit/ca206ac))
- Add benchmarking for encoding methods ([94af1ae](https://github.com/blokwise/h3-compression/commit/94af1ae))
- Add benchmarking for useCompression options ([fe04837](https://github.com/blokwise/h3-compression/commit/fe04837))
- Update tests ([f0a696f](https://github.com/blokwise/h3-compression/commit/f0a696f))
- Remove unnecessary console statement ([a56fa42](https://github.com/blokwise/h3-compression/commit/a56fa42))
- Increase test timeout ([3cc4cc2](https://github.com/blokwise/h3-compression/commit/3cc4cc2))
- Ensure server ports are created correctly in parallel test executions ([5f9b892](https://github.com/blokwise/h3-compression/commit/5f9b892))
- Add smaller dataset for non-bench tests ([9357819](https://github.com/blokwise/h3-compression/commit/9357819))

### ❤️ Contributors

- Julian Derungs ([@aerophobic](https://github.com/aerophobic))

## v0.5.3

[compare changes](https://github.com/blokwise/h3-compression/compare/v0.5.2...v0.5.3)

### 🚀 Enhancements

- Add decoding handler ([4cca3c5](https://github.com/blokwise/h3-compression/commit/4cca3c5))

### ❤️ Contributors

- Julian Derungs ([@aerophobic](https://github.com/aerophobic))

## v0.5.2

[compare changes](https://github.com/blokwise/h3-compression/compare/v0.5.1...v0.5.2)

### 🩹 Fixes

- Export of EncodingMethods enum ([b7a9e2e](https://github.com/blokwise/h3-compression/commit/b7a9e2e))

### 🏡 Chore

- Recreate lockfile ([04a2bdc](https://github.com/blokwise/h3-compression/commit/04a2bdc))

### ❤️ Contributors

- Julian Derungs ([@aerophobic](https://github.com/aerophobic))

## v0.5.1

[compare changes](https://github.com/blokwise/h3-compression/compare/v0.5.0...v0.5.1)

### 🚀 Enhancements

- Add compression handler and utils as dedicated export ([45e7bc3](https://github.com/blokwise/h3-compression/commit/45e7bc3))

### 💅 Refactors

- Reorganize modules ([89a45ab](https://github.com/blokwise/h3-compression/commit/89a45ab))

### ❤️ Contributors

- Julian Derungs ([@aerophobic](https://github.com/aerophobic))

## v0.5.0

[compare changes](https://github.com/blokwise/h3-compression/compare/v0.4.1...v0.5.0)

### 🚀 Enhancements

- Add zstd compression ([552b73b](https://github.com/blokwise/h3-compression/commit/552b73b))
- Ensure zstd is only used when node version includes the feature ([870a9ab](https://github.com/blokwise/h3-compression/commit/870a9ab))
- Enable specifying min size threshold for compression ([08465de](https://github.com/blokwise/h3-compression/commit/08465de))
- Disable zstd by default and introduce encoding methods options ([15d6f1a](https://github.com/blokwise/h3-compression/commit/15d6f1a))
- Add async and stream executor and enable zstd by default ([046c6f7](https://github.com/blokwise/h3-compression/commit/046c6f7))

### 💅 Refactors

- Extract compressed buffer creation into utility ([1c0c996](https://github.com/blokwise/h3-compression/commit/1c0c996))

### 📖 Documentation

- Update readme ([768cc03](https://github.com/blokwise/h3-compression/commit/768cc03))

### 🏡 Chore

- Recreate lockfile ([1085855](https://github.com/blokwise/h3-compression/commit/1085855))

### ✅ Tests

- Add tests for zstd compression ([2d52ee5](https://github.com/blokwise/h3-compression/commit/2d52ee5))
- Update tests ([bf13409](https://github.com/blokwise/h3-compression/commit/bf13409))
- Update tests ([2dc7bf6](https://github.com/blokwise/h3-compression/commit/2dc7bf6))

### ❤️ Contributors

- Julian Derungs ([@aerophobic](https://github.com/aerophobic))

## v0.4.1

[compare changes](https://github.com/blokwise/h3-compression/compare/v0.4.0...v0.4.1)

### 🚀 Enhancements

- Export compress, compressStream and getMostSuitableCompression utilities ([e79a06d](https://github.com/blokwise/h3-compression/commit/e79a06d))
- Enhance brotli compression performance and improve composability ([#1](https://github.com/blokwise/h3-compression/pull/1))

### 💅 Refactors

- Enhance performance of checking if compression should be applied and separate compression handlers from setting compressed response body ([29a6c6f](https://github.com/blokwise/h3-compression/commit/29a6c6f))

### 🏡 Chore

- Add @antfu/utils to deps ([7aed8cb](https://github.com/blokwise/h3-compression/commit/7aed8cb))

### ❤️ Contributors

- Julian Derungs ([@aerophobic](https://github.com/aerophobic))

## v0.4.0

[compare changes](https://github.com/blokwise/h3-compression/compare/v0.3.3...v0.4.0)

### 🚀 Enhancements

- Improve brotli compression performance and enable configuring mode ([b38bcaf](https://github.com/blokwise/h3-compression/commit/b38bcaf))

### 💅 Refactors

- Clean up playground ([35fc827](https://github.com/blokwise/h3-compression/commit/35fc827))
- Rename playground dir ([7bd6cb3](https://github.com/blokwise/h3-compression/commit/7bd6cb3))

### 📖 Documentation

- Update readme ([12c900e](https://github.com/blokwise/h3-compression/commit/12c900e))

### 📦 Build

- Update build config and exports ([bfa98d9](https://github.com/blokwise/h3-compression/commit/bfa98d9))

### 🏡 Chore

- Bump dev deps ([c1c8702](https://github.com/blokwise/h3-compression/commit/c1c8702))
- Update eslint config ([ed02b25](https://github.com/blokwise/h3-compression/commit/ed02b25))
- Add vscode settings ([d3d362c](https://github.com/blokwise/h3-compression/commit/d3d362c))
- Update tsconfig ([c3b08d1](https://github.com/blokwise/h3-compression/commit/c3b08d1))
- Update dev tools configs ([fb04cfc](https://github.com/blokwise/h3-compression/commit/fb04cfc))
- Add nuxt dev deps ([cc81d67](https://github.com/blokwise/h3-compression/commit/cc81d67))
- Rename scripts ([adb3494](https://github.com/blokwise/h3-compression/commit/adb3494))

### ✅ Tests

- Lint test files ([e044ce1](https://github.com/blokwise/h3-compression/commit/e044ce1))
- Update tests ([4c1c200](https://github.com/blokwise/h3-compression/commit/4c1c200))

### 🤖 CI

- Migrate to @blokwise/relee for releasing ([0c69ab5](https://github.com/blokwise/h3-compression/commit/0c69ab5))

### ❤️ Contributors

- Julian Derungs ([@aerophobic](https://github.com/aerophobic))

