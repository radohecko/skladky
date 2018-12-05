import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as sendGrid from '@sendgrid/mail';

admin.initializeApp(functions.config().firebase);

const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
sendGrid.setApiKey(firebaseConfig.sendGrid.key);

export const firestoreEmail = functions.firestore
  .document('dumps/{dumpId}/')
  .onUpdate(event => {

    const dumpId = event.params.dumpId;
    const db = admin.firestore();

    return db.collection('dumps').doc(dumpId)
      .get()
      .then(doc => {

        const dump = doc.data()

        if (dump.email !== '') {
          const msg = {
            to: dump.email,
            from: 'forestdumps2018@gmail.com',
            subject: 'Resolved dump report',
            text: `Hey ${dump.email}. Dump was resolved!!! Thank you for making earth cleaner.`,
  
            // TODO: create custom template
            // custom templates
            templateId: '',
            substitutionWrappers: ['{{', '}}'],
            substitutions: {
              name: dump.email
              // and other custom properties here
            }
          };
  
          return sendGrid.send(msg)
        }
      })
      .then(() => console.log('email sent!'))
      .catch(err => console.log(err));
  });
