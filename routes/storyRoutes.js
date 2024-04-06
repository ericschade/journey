const express = require('express');
const { generatePrompt } = require('../utils/promptGenerator');
const Memory = require('../models/memoriesCollectionSchema');
const Character = require('../models/characterSchema');
const { isAuthenticated } = require('./middleware/authMiddleware');
const router = express.Router();
const axios = require('axios');



async function generateEmbedding(text) {
  const embeddingUrl = 'https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2';
  try {
      const response = await axios.post(embeddingUrl, { inputs: text }, {
          headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` }
      });

      if (response.status !== 200) {
          throw new Error(`Request failed with status code ${response.status}: ${response.statusText}`);
      }

      return response.data;
  } catch (error) {
      console.error(error);
  }
}


router.post('/submit-story', isAuthenticated, async (req, res) => {
  

  try {
    const { text } = req.body;
    const promptWords = generatePrompt();
    const textEmbedding = await generateEmbedding(text);

    // LLM Call A
    const formattedPromptA = `You are a therapist responsible for analyzing your patient’s thoughts in response to two words[ ${promptWords.join(', ')}]. You must identify the following aspects of their response:
    - Name a personality Trait that you believe pertains to the patient, according to their thoughts. Explain your reasoning in a short summary.
    - Identify any characters by name that are mentioned in the patient’s thoughts, and describe their relationship(s) to the patient
    - Label the patient’s response as one or more of the following: Emotional, Factual, Anecdotal. Do not explain your reasoning.

    Patient Thoughts:
    ${text}`;
    const LLM_Call_A_system_message = "You are an observant therapist.";

    const llmResponseA = await axios.post(process.env.LLM_API_URL, {
      messages: [{ "role":"system", "content":LLM_Call_A_system_message }, { "role":"user", "content":formattedPromptA }],
      model: process.env.LLM_MODEL,
      temperature: 0.5, // Adjust as necessary for creativity of the output
      max_tokens: 1024, // Maximum length of the generated summary
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.LLM_API_KEY}`,
        'Content-Type': 'application/json',
      }
    });
    
    const llmTextEmbedding = await generateEmbedding(text);
    const memory = new Memory({
      promtWords: promptWords,
      rawTextResponse: text,
      textResponseEmbedding: textEmbedding,
      metadataTextResponse: llmResponseA.data.choices[0].message.content,
      metadataTextResponseEmbedding: llmTextEmbedding
    });
    await memory.save();
    console.log('Memory saved successfully')

    // LLM Call B
    const formattedPromptB = `The text provided is a report written by a therapist about their patient’s thoughts. It may contain information on characters in the patients thoughts, and you are responsible for serializing that data.
Write json objects from the following text that refer to any characters mentioned in the text. Do not add any tags to the text you return. The json should have the following format:

[
{
		"Name": "{character_name}",
		"description": "{relationship_to_patient}"
}
]

The therapist report is the following:
${llmResponseA.data.choices[0].message.content}

-----------
If there are no characters mentioned in the text or the report is malformatted, write only an empty array:
[]

`;

// const LLM_Call_B_system_message = "You are an expert at extracting and serializing data from text.";
//     const llmResponseB = await axios.post(process.env.LLM_API_URL, {
//       messages: [{ "role":"system", "content":LLM_Call_B_system_message }, { "role":"user", "content":formattedPromptB }],
//       model: process.env.LLM_MODEL,
//       temperature: 0.5, // Adjust as necessary for creativity of the output
//       max_tokens: 1024, // Maximum length of the generated summary
//     }, {
//       headers: {
//         'Authorization': `Bearer ${process.env.LLM_API_KEY}`,
//         'Content-Type': 'application/json',
//       }
//     });

    // Process characters
    // const charactersString = llmResponseB.data.choices[0].message.content;
    // console.log(charactersString);
    
    // const characters = JSON.parse(charactersString);
    
    // for (const char of charactersString) {
    //   let character = await Character.findOne({ name: char.Name });
    //   if (!character) {
    //     character = new Character({
    //       name: char.Name,
    //       stories: [story._id],
    //       description: char.relationship
    //     });
    //   } else {
    //     character.stories.push(story._id);
    //   }
    //   await character.save();
    // }

    // res.json({ message: 'Story submitted successfully' });
  } catch (error) {
    console.error('Error submitting story:', error.message);
    console.error(error.stack);
    res.status(500).send('Error submitting story');
  }
});

module.exports = router;