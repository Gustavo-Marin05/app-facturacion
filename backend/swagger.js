import swaggerAutogen from 'swagger-autogen'

const outputFile = './swagger.json'

const endPointsFiles = ['./src/app.js']

const doc= {

    info:{
        title:'api de facturacion',
        description:'esta api es un sistema de facturacion'
    },
    host:'localhost:4000',
    schemes:['http']
}

swaggerAutogen()(outputFile,endPointsFiles,doc)  