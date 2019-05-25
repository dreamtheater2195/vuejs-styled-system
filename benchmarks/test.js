const Benchmark = require('benchmark')

const system = require('system-v4')
const smooth = require('@2s/smooth-system')
const next = require('styled-system')
const { css } = require('@styled-system/css')

// build is broken on github
// const smooth = require('smooth-system')

const theme = {
  breakpoints: [
    '32em', '48em', '64em',
  ],
  space: [
    0, 4, 8, 16, 32, 64, 128, 256
  ],
  fontSizes: [
    3, 6, 12, 24, 48, 96,
    // 12, 14, 16, 24, 32, 48, 64
  ],
  colors: {
    text: 'black',
    background: 'white',
    primary: 'tomato',
  },
}

const tests = [
  {
    name: 'space',
    libs: {
      system: system.space,
      smooth: smooth.space,
      next: next.space,
      css: ({ theme, ...rest }) => css(rest)(theme),
    },
    run: fn => () => fn({
      theme,
      m: 0,
      mx: 'auto',
      mb: 2,
      px: [3, 4],
      py: [4, 5],
    })
  },
  {
    name: 'fontSize',
    libs: {
      system: system.fontSize,
      smooth: smooth.fontSize,
      next: next.fontSize,
      css: ({ theme, ...rest }) => css(rest)(theme),
    },
    run: fn => () => fn({
      theme,
      fontSize: 4,
    })
  },
  {
    name: 'fontSize responsive',
    libs: {
      system: system.fontSize,
      smooth: smooth.fontSize,
      next: next.fontSize,
      css: ({ theme, ...rest }) => css(rest)(theme),
    },
    run: fn => () => fn({
      theme,
      fontSize: [ 3, 4, 5, 6 ],
    })
  },
  {
    name: 'compose',
    libs: {
      system: system.compose(
        system.space,
        system.color,
        system.fontSize,
      ),
      smooth: smooth.compose(
        smooth.space,
        smooth.color,
        smooth.fontSize,
      ),
      next: next.compose(
        next.space,
        next.color,
        next.fontSize,
      ),
      css: ({ theme, ...rest }) => css(rest)(theme),
    },
    run: fn => () => fn({
      theme,
      fontSize: [ 3, 4, 5, 6 ],
      m: 0,
      mx: 'auto',
      mb: 4,
      px: 4,
      py: [ 5, 6 ],
      bg: 'primary',
    })
  },
]

const suite = new Benchmark.Suite()

tests.forEach(test => {
  console.log(test.name)
  Object.keys(test.libs).forEach(key => {
    const fn = test.libs[key]
    const t = test.run(fn)
    // debugging
    console.log(key, t())
    suite.add(`${test.name}: ${key}`, t)
  })
})

suite
  .on('cycle', event => {
    console.log(String(event.target))
  })
  .on('complete', function onComplete() {
    console.log(`Fastest is ${this.filter('fastest').map('name')}`)
  })
  .run({ async: true })