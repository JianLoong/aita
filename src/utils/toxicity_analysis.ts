// // import * as toxicity from "@tensorflow-models/toxicity";

// // const threshold = 0.9;

// // export default function toxicityAnalysis(sentences: []) {
// //   toxicity.load(threshold, []).then(async (model) => {
    
// //     await model.classify(sentences).then((predictions) => {
// //       console.log(predictions);

// //       return predictions;
// //     });
// //   });
// // }
// const result =[
//     {
//         "label": "identity_attack",
//         "results": [
//             {
//                 "probabilities": {
//                     "0": 0.9999315738677979,
//                     "1": 0.00006843128358013928
//                 },
//                 "match": false
//             }
//         ]
//     },
//     {
//         "label": "insult",
//         "results": [
//             {
//                 "probabilities": {
//                     "0": 0.9996167421340942,
//                     "1": 0.00038317323196679354
//                 },
//                 "match": false
//             }
//         ]
//     },
//     {
//         "label": "obscene",
//         "results": [
//             {
//                 "probabilities": {
//                     "0": 0.9999160766601562,
//                     "1": 0.00008387925481656566
//                 },
//                 "match": false
//             }
//         ]
//     },
//     {
//         "label": "severe_toxicity",
//         "results": [
//             {
//                 "probabilities": {
//                     "0": 0.9999998807907104,
//                     "1": 7.94931267478205e-8
//                 },
//                 "match": false
//             }
//         ]
//     },
//     {
//         "label": "sexual_explicit",
//         "results": [
//             {
//                 "probabilities": {
//                     "0": 0.9999297857284546,
//                     "1": 0.00007023746002232656
//                 },
//                 "match": false
//             }
//         ]
//     },
//     {
//         "label": "threat",
//         "results": [
//             {
//                 "probabilities": {
//                     "0": 0.9999171495437622,
//                     "1": 0.00008289603283628821
//                 },
//                 "match": false
//             }
//         ]
//     },
//     {
//         "label": "toxicity",
//         "results": [
//             {
//                 "probabilities": {
//                     "0": 0.9992278814315796,
//                     "1": 0.0007721742731519043
//                 },
//                 "match": false
//             }
//         ]
//     }
// ];

// const transformResult = (result) => {
//     const processed = {};

//     processed[""]
// }