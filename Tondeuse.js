/**
 * Création d'un objet tondeuse
 * coordPelouse coordonnées du coin superieur droit de la pelouse
 * initPosition position initiale de la tondeuse
 * sequence série d'instructions pour faire bouger la tondeuse
 */
class Tondeuse {
    constructor(coordPelouse, initPosition, sequence, id) {
        this.coordPelouse = coordPelouse
        this.position = initPosition
        this.sequence = sequence
        this.id = id
    }

    //Coordonnée de déplacement selon le point cardinal
    moveTondeuse = {
        N: {
            F: [0, 1]
        },
        E: {
            F: [1, 0]
        },
        W: {
            F: [-1, 0]
        },
        S: {
            F: [0, -1]
        }
    }

    //Tableau des points cardinaux
    orientationArray = ['N', 'E', 'W', 'S']

    /**
     * verification des coordonnées de la pelouse
     * @param pelouseArray
     * @returns {`checkPelouseData [${string}]`}
     */
    checkPelouseData = (pelouseArray) => {
        if (!pelouseArray || !Array.isArray(pelouseArray)) {
            throw new Error('[Pelouse Data] Les coordonnées de la pelouse doivent être un tableau')
        }
        if (pelouseArray.length !== 2) {
            throw new Error('[Pelouse Data] Les coordonnées de la pelouse ne sont pas valides')
        }
        this.coordPelouse = pelouseArray.map(val => {
            if (isNaN(val) || val === null) {
                throw new Error('[Pelouse Data] Les valeurs ne sont pas numériques')
            }
            val = Number(val)
            if (!Number.isInteger(val) || val < 0) {
                throw new Error('[Pelouse Data] Les valeurs ne sont pas des nombres entiers')
            }
            return val
        })
        return `checkPelouseData [${this.coordPelouse}]`
    }

    /**
     * Vérification de la position de la tondeuse
     * @param positionArray
     * @returns {`checkPositionData [${string}]`}
     */
    checkPositionData = (positionArray) => {
        if (!positionArray || !Array.isArray(positionArray)) {
            throw new Error('[Position Data] Les coordonnées de la tondeuse doivent être un tableau')
        }
        if (positionArray.length !== 3) {
            throw new Error('[Position Data] Les coordonnées de la tondeuse ne sont pas valides')
        }
        let [xPosition, yPosition, orientation] = positionArray
        if (isNaN(xPosition) || isNaN(yPosition)) {
            throw new Error('[Position Data] Les deux premières valeurs doivent être numériques')
        }
        xPosition = Number(xPosition)
        yPosition = Number(yPosition)
        if (!Number.isInteger(xPosition) || !Number.isInteger(yPosition)
            || xPosition < 0 || yPosition < 0) {
            throw new Error('[Position Data] Les deux premières valeurs doivent être des entiers positifs')
        }
        if (xPosition > this.coordPelouse[0] || yPosition > this.coordPelouse[1]) {
            throw new Error('[Position Data] La position initiale de la tondeuse est en dehors de la pelouse')
        }
        orientation = orientation.toUpperCase()
        if (!(/N|E|W|S/).test(orientation) || orientation.length !== 1) {
            throw new Error('[Position Data] Ce point cardinal est inexistant')
        }
        this.position = positionArray
        //console.log(this.position)
        return `checkPositionData [${this.position}]`
    }

    /**
     * Verification de la séquence d'instructions de déplacement
     * @param dataArray
     * @returns {string|`checkSequenceData [${*}]`}
     */
    checkSequenceData = (dataArray) => {
        if (!dataArray || !Array.isArray(dataArray)) {
            throw new Error('[Sequence Data] La sequence doit être un tableau')
        }
        if (!dataArray.length) {
            throw new Error('[Sequence Data] La séquence est inexistante')
        }
        dataArray.forEach(item => {
            if (item.length !== 1) {
                throw new Error('[Sequence Data] Instruction incorrecte')
            }
        })
        const val = dataArray.join('').replace(/F|R|L/g, '')
        if (val.length) {
            throw new Error(`[Sequence Data] La séquence est incorrecte: ${val}`)
        }
        return `checkSequenceData [${dataArray}]`
    }

    /**
     * Vérification de la position avant déplacement
     * @param positionArray
     * @returns {boolean}
     */
    checkBeforeMove = (positionArray) => {
        let [xPosition, yPosition] = positionArray
        //console.log('posArr' + positionArray)
        //console.log(yPosition <= this.coordPelouse[1])
        return xPosition <= this.coordPelouse[0] && xPosition >= 0 && yPosition <= this.coordPelouse[1] && yPosition >= 0
    }


    /**
     * Effectue la sequence d'instructions
     * @param positionArray
     * @param moves
     * @returns {`Position Finale : [${string}]`}
     */
    process = (positionArray, moves) => {
        if (!positionArray || !moves) {
            throw new Error('[Process] Il manque des arguments')
        }
        if (!Array.isArray(positionArray) || !Array.isArray(moves)) {
            throw new Error('[Process] Les arguments doivent être un tableau')
        }
        let [xPosition, yPosition, orientation] = positionArray
        //console.log('orient' + orientation)
        moves.forEach(move => {
            if (move === 'R') {
                switch (orientation) {
                    case 'N':
                        orientation = 'E';
                        break;
                    case 'W':
                        orientation = 'N';
                        break;
                    case 'S':
                        orientation = 'W';
                        break;
                    case 'E':
                        orientation = 'S';
                        break;
                    default:
                        break;
                }
            } else if (move === 'L') {
                switch (orientation) {
                    case 'N':
                        orientation = 'W';
                        break;
                    case 'W':
                        orientation = 'S';
                        break;
                    case 'S':
                        orientation = 'E';
                        break;
                    case 'E':
                        orientation = 'N';
                        break;
                    default:
                        break;
                }
            } else {
                const moveTondeuse = this.moveTondeuse[orientation][move]
                xPosition = Number(xPosition)
                yPosition = Number(yPosition)
                xPosition += moveTondeuse[0]
                yPosition += moveTondeuse[1]
                //console.log(xPosition)
                //console.log(yPosition)
            }
            const nextPosition = [xPosition, yPosition, orientation]
            //console.log('nextPos' + nextPosition)
            //console.log(positionArray)
            //Si la tondeuse depasse les limites de la pelouse alors on renvoie la dernière position
            this.position = this.checkBeforeMove(nextPosition) ? [...nextPosition] : this.position
            //console.log('pos' + this.position)

        })
        return `Position Finale : [${this.position}]`
    }

    /**
     * Lancement des vérifications et du process
     */
    init = () => {
        try {
            this.checkPelouseData(this.coordPelouse)
            this.checkPositionData([...this.position])
            this.checkSequenceData([...this.sequence])
            this.process([...this.position], [...this.sequence])

            console.log(`Position Finale de la ${this.id} ==> ${this.position.join(' ')}`)
        } catch (error) {
            console.log('Error:', error.message)
        }
    }
}

module.exports = Tondeuse
