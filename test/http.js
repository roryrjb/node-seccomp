'use strict'

/* global describe, it */

const assert = require('assert')
const http = require('http')

const seccomp = require('../')

const { stdio, inet, proc } = seccomp
seccomp(stdio, inet, proc)

let counter = 0

describe('simple http test', () => {
  it('should work in both directions', (done) => {
    const server = http.createServer((req, res) => {
      res.end('hello world\n')
    }).listen(9999, () => {
      counter++

      http.get('http://localhost:9999', (res) => {
        let rawData = ''

        res.on('data', (chunk) => { rawData += chunk })

        res.on('end', () => {
          assert.equal(rawData, 'hello world\n')
          counter++

          server.close(done)
        })
      })
    })
  })

  it('execution as expected', () => {
    assert.equal(counter, 2)
  })
})
