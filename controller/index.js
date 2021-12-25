const path = require('path')
const { v4: uuidv4, validate: isUuid } = require('uuid')
const { get, set, expire, del } = require('../redis')
const isValidUrl = require('../util/isValidUrl')

exports.urlToHash = async function(req, res) {
    const { url, singleUse } = req.body

    if ( !isValidUrl(url) ) {
        res.send({ error: "Send a valid url" })
        return;
    }

    let key = uuidv4()
    
    let result = await set( key, url )
    
    if( singleUse ) {
        await set(`single:${key}`, 1)
        console.log(singleUse)
    }

    if ( result === 'OK' )
    res.send({ hash: key })
    else
    res.send({ error: "Something went wrong" })
}

exports.hashToUrl = function(req, res) {
    const { hash } = req.body
    checkHashUrl(hash, (error, url) => {
        if( error ){
            res.send({ error })
            return
        }
        res.send({ url })
    })
}

exports.redirect = function(req, res){
    const { hash } = req.params
    checkHashUrl(hash, (error, url) => {
        if(error) {
            res.sendFile(path.resolve('public/404.html'))
            return
        }

        // If single-use hash - then delete key-value from db
        isHashSingleUse(hash, (err, d) => { if(d) del([ hash, `single:${hash}` ]) })

        res.redirect( url || '/404' )
    })
}

const isHashSingleUse = async function(hash, cb){
    if( !isUuid(hash) ){
        return
    }

    let result = await get( `single:${hash}` )
    cb(null, result)
}

const checkHashUrl = async function(hash, cb){
    if( !isUuid(hash) ){
        cb("Invalid hash", null)
        return
    }

    let result = await get( hash )
    cb(null, result)
}

