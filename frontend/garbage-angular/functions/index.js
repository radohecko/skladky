const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const sendGrid = require('@sendgrid/mail');
const SENDGRID_API_KEY = functions.config().sendgrid.key;
sendGrid.setApiKey(SENDGRID_API_KEY);

exports.firestoreEmail = functions.firestore
    .document('dumps/{id}')
    .onUpdate(event => {

        const dumpId = event.params.id;
        const db = admin.firestore();

        return db.collection('dumps').doc(dumpId)
            .get()
            .then(doc => {

                const dump = doc.data()

                if (dump.email !== '' && dump.status === 'Resolved') {
                    sendGrid.setSubstitutionWrappers('{{', '}}');
                    const msg = {
                        to: dump.email,
                        from: 'forestdumps2018@gmail.com',
                        subject: 'Resolved dump report',
                        // text: `Hey ${dump.email}. Dump was resolved!!! Thank you for making earth cleaner.`,
                        templateId: 'd-a7079c38ac5b431aad2c7eb6fd2cf74e',
                        substitutions: {
                            name: dump.email
                            // and other custom properties here
                        }
                    };

                    return sendGrid.send(msg);
                }
            })
            .then(() => console.log('email sent!'))
            .catch(err => console.log(err));
    });
