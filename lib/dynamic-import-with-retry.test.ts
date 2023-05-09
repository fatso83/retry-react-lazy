import  createDynamicImportWithRetry  from './dynamic-import-with-retry'

function createChromeImportError(path: string) {
  return new Error(`Failed to fetch dynamically imported module: ${path}`)
}

function createFirefoxImportError(path: string) {
  return new Error(`Failed to fetch dynamically imported module: ${path}`)
}

async function createNodeImportError(path: string) {
  let caught
  try {
    // @ts-ignore
    await import('../../foo/bar/baz/random1234') // => TypeError: Invalid URL
  } catch (err) {
    caught = err
  }
  return caught
}

const path = 'https://foobar.com/assets/foo-a123.js'

async function testErrorHandling(networkError: Error) {
  const originalImport = jest.fn().mockRejectedValueOnce(networkError)

  // unsure how to use Jest's fake timers to control the time completely with promises ...
  jest.useFakeTimers({ now: 1000, doNotFake: ['setTimeout'] })
  const importStub = jest.fn()
  importStub.mockResolvedValueOnce('export default () => <div>42</div>')

  const dynamicImportWithRetry = createDynamicImportWithRetry(1, {importFunction: importStub})

  const promise = dynamicImportWithRetry(originalImport /* will not be used */)
  jest.advanceTimersByTime(1000)
  await promise

  expect(originalImport).toHaveBeenCalledTimes(1)
  expect(importStub).toHaveBeenCalledTimes(1)
  expect(importStub).toBeCalledWith('https://foobar.com/assets/foo-a123.js?t=2000' /* 1000 + 1000 */)
}

describe('createDynamicImportWithRetry bust the cache of a module using the current time', () => {
  test('chrome handling', async () => testErrorHandling(createChromeImportError(path)))
  // TODO?:
  //test('firefox handling', async () => testErrorHandling(createFirefoxImportError(path)))
  //test('node handling', async () => testErrorHandling(await createNodeImportError(path)))
})