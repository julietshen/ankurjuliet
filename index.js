const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 5000

const {Pool} = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const insertRsvp = async (rsvp_code, family_name, invited_to_garba, number_invited_garba, number_rsvpd_garba, invited_to_haldi, number_invited_haldi, number_rsvpd_haldi, invited_to_mehndi, number_invited_mehndi, number_rsvpd_mehndi, invited_to_wedding, number_invited_wedding, number_rsvpd_wedding, number_rsvpd_reception) => {
    console.log(`${rsvp_code}, ${family_name}, ${invited_to_garba}, ${number_invited_garba}, ${number_rsvpd_garba}, ${invited_to_haldi}, ${number_invited_haldi}, ${number_rsvpd_haldi}, ${invited_to_mehndi}, ${number_invited_mehndi}, ${number_rsvpd_mehndi}, ${invited_to_wedding}, ${number_invited_wedding}, ${number_rsvpd_wedding}, ${number_rsvpd_reception}`)
    const query = `
        INSERT INTO rsvp(rsvp_code, family_name, invited_to_garba, number_invited_garba, number_rsvpd_garba, invited_to_haldi, number_invited_haldi, number_rsvpd_haldi, invited_to_mehndi, number_invited_mehndi, number_rsvpd_mehndi, invited_to_wedding, number_invited_wedding, number_rsvpd_wedding, number_rsvpd_reception)
        VALUES ('${rsvp_code}', '${family_name}', ${invited_to_garba}, ${number_invited_garba}, ${number_rsvpd_garba}, ${invited_to_haldi}, ${number_invited_haldi}, ${number_rsvpd_haldi}, ${invited_to_mehndi}, ${number_invited_mehndi}, ${number_rsvpd_mehndi}, ${invited_to_wedding}, ${number_invited_wedding}, ${number_rsvpd_wedding}, ${number_rsvpd_reception})
        ON CONFLICT (rsvp_code)
        DO UPDATE SET family_name = '${family_name}', 
                    invited_to_garba = ${invited_to_garba},
                    number_invited_garba = ${number_invited_garba},
                    number_rsvpd_garba = ${number_rsvpd_garba},
                    invited_to_haldi = ${invited_to_haldi},
                    number_invited_haldi = ${number_invited_haldi},
                    number_rsvpd_haldi = ${number_rsvpd_haldi},
                    invited_to_mehndi = ${invited_to_mehndi},
                    number_invited_mehndi = ${number_invited_mehndi},
                    number_rsvpd_mehndi = ${number_rsvpd_mehndi},
                    invited_to_wedding = ${invited_to_wedding},
                    number_invited_wedding = ${number_invited_wedding},
                    number_rsvpd_wedding = ${number_rsvpd_wedding},
                    number_rsvpd_reception = ${number_rsvpd_reception}
        RETURNING rsvp_code, family_name, invited_to_garba, number_invited_garba, number_rsvpd_garba, invited_to_haldi, number_invited_haldi, number_rsvpd_haldi, invited_to_mehndi, number_invited_mehndi, number_rsvpd_mehndi, invited_to_wedding, number_invited_wedding, number_rsvpd_wedding, number_rsvpd_reception
    `;

    return pool.query(query);
}


const addRSVP = async (req, res) => {
    console.log(req.body)
    const {
        rsvp_code,
        family_name,
        number_invited_garba,
        number_invited_haldi,
        number_invited_mehndi,
        number_invited_wedding
    } = req.body;


    let invited_to_garba = false;
    const number_rsvpd_garba = 0;
    if (number_invited_garba > 0) {
        invited_to_garba = true;
    }

    let invited_to_haldi = false;
    const number_rsvpd_haldi = 0;
    if (number_invited_haldi > 0) {
        invited_to_haldi = true;
    }

    let invited_to_mehndi = false;
    const number_rsvpd_mehndi = 0;
    if (number_invited_mehndi > 0) {
        invited_to_mehndi = true;
    }


    let invited_to_wedding = false;
    let number_rsvpd_wedding = 0;
    let number_rsvpd_reception = 0;
    if (number_invited_wedding > 0) {
        invited_to_wedding = true;
    }
    try {
        const data = await insertRsvp(rsvp_code,
            family_name,
            invited_to_garba,
            number_invited_garba,
            number_rsvpd_garba,
            invited_to_haldi,
            number_invited_haldi,
            number_rsvpd_haldi,
            invited_to_mehndi,
            number_invited_mehndi,
            number_rsvpd_mehndi,
            invited_to_wedding,
            number_invited_wedding,
            number_rsvpd_wedding,
            number_rsvpd_reception);
        res.status(200).json({messages: data.rows});
    } catch (err) {
        res.status(200).json({messages: err.stack});
    }
};

const app = express()

app.use(bodyParser.json())

app.post('/rsvp-add', async (req, res) => {
    try {
        addRSVP(req, res)
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
})

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => res.render('pages/index'))
app.get('/db', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM rsvp');
        const results = {'results': (result) ? result.rows : null};
        res.render('pages/db', results);
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
})
app.get('/rsvp', async (req, res) => {
    try {
        let code = req.query["code"]
        console.log(`CODE IS ${code}`)
        // const queryResults = await pool.query(`SELECT * FROM rsvp WHERE rsvp_code='${code}'`);
        // const rsvp = queryResults.rows[0]
        // console.log(rsvp)
        const rsvp = {
                rsvp_code: 'GREEN105',
                family_name: 'Ankur Vashi and Juliet Shen',
                invited_to_garba: true,
                number_invited_garba: 2,
                number_rsvpd_garba: 0,
                invited_to_haldi: false,
                number_invited_haldi: 0,
                number_rsvpd_haldi: 0,
                invited_to_mehndi: true,
                number_invited_mehndi: 1,
                number_rsvpd_mehndi: 0,
                invited_to_wedding: true,
                number_invited_wedding: 2,
                number_rsvpd_wedding: 0,
                number_rsvpd_reception: 0
            }

        const results = {'results': rsvp};
        res.render('pages/rsvp', results);
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
})


app.listen(PORT, () => console.log(`Listening on ${PORT}`))




