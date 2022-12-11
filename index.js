const fs = require('fs')
const readline = require('readline')
const Tondeuse = require('./Tondeuse')

const programme = {}

/**
 *
 * @param dataArray
 */
const initData = (dataArray) => {
    //Récupération des coordonnées du coin supérieur droit de la pelouse
    programme.coordPelouse = dataArray[0].trim().toUpperCase().split('')
    //On parcours le tableau des instructions
    for (let i = 1; i < dataArray.length; i++) {
        //Pour aller chercher les infos dans le tableau aux positions 1 et 3 du tableau de données
        if (i % 2 !== 0) {
            //Récuperation de la position de départ des tondeuses
            const initPosition = dataArray[i].trim().toUpperCase().split('')
            programme.startPositions = programme.startPositions ? programme.startPositions.concat([initPosition]) : [initPosition]
        } else {
            //Récuperation de la séquence de déplacement aux positions 2 et 4 du tableau de données
            const initSequence = dataArray[i].toUpperCase().replace(/\s+/g, '').split('')
            programme.sequence = programme.sequence ? programme.sequence.concat([initSequence]) : [initSequence]
        }
    }
}


const init = () => {
    //Déclaration d'un tableau où sera enregistré les données d'instructions
    const data = []

    //Lecture ligne par ligne du fichier instructions.txt
    var rl = readline.createInterface({
        input: fs.createReadStream('./data/instructions.txt')
    })

    //On enregistre chaque ligne dans le tableau data
    rl.on('line', (line) => {
        data.push(line)
    })
        .on('close', (line) => {
            //console.log(data)
            initData(data)
            for (let i = 0; i < programme.startPositions.length; i++) {
                //Déclaration d'une instance pour chaque tondeuse
                const tondeuse = new Tondeuse(programme.coordPelouse, programme.startPositions[i], programme.sequence[i], `Tondeuse N°${i + 1} `)
                tondeuse.init()
            }
        })
}

init()
