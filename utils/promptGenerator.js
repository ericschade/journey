const thirdGradeVocabularyWords = [
    'abound', 'brisk', 'canal', 'deed', 'eager', 
    'faint', 'gallery', 'haste', 'ideal', 'jealous', 
    'keen', 'lively', 'massive', 'nest', 'observe', 
    'patch', 'quest', 'rapid', 'scarce', 'tale', 
    'uniform', 'vast', 'weary', 'yearn', 'zone'
];

function generatePrompt() {
    const wordIndices = new Set();
    while (wordIndices.size < 2) {
        const randomIndex = Math.floor(Math.random() * thirdGradeVocabularyWords.length);
        wordIndices.add(randomIndex);
    }

    const promptWords = Array.from(wordIndices).map(index => thirdGradeVocabularyWords[index]);
    console.log(`Generated prompt words: ${promptWords.join(', ')}`);
    return promptWords;
}

module.exports = { generatePrompt };