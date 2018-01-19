const { send } = require('micro');
const url = require('url');
const level = require('level');
const promisify = require('then-levelup');

const visits = {};

const db = promisify(level('visits.db', {
  valueEncoding: 'json'
}))

module.exports = async (req, res) => {
  const { pathname } = url.parse(req.url)

  try {
    const currentVisits = await db.get(pathname)
    await db.put(pathname, currentVisits + 1)
  } catch (error) {
    if (error.notFound) await db.put(pathname, 1)
  }

  send(res, 200, `This page has ${await db.get(pathname)} visits!`)
}
