const express = require('express')
const router  = express.Router()

const dataRepo = require('../Project/Repository/DataRepo')
const dataService = require('../Project/Service/DataService')

router.post('/', async (req, res, next) => {
  try {
    const constrain = dataService.generateConstrain(req.body)
    const data      = await dataRepo.getData(constrain)
    res.status(200).json({ data: data })
  } catch (e) {
    res.status(400).json({ error: 'server error'})
  }
})

router.get('/location', async (req, res, next) => {
  try {
    const location = await dataRepo.getLocation()
    res.status(200).json({ location: location })
  } catch(e) {
    res.status(400).json({ error: 'server error'})
  }
})

router.get('/tags', async (req, res, next) => {
  try {
    const tags = await dataRepo.getTags()
    res.status(200).json({ tags: tags })
  } catch(e) {
    res.status(400).json({ error: 'server error'})
  }
})

module.exports = router
