function isValidBrackets(s) {
    if (s.length === 0) return true;
    
    const matchingBracket = {
        ')': '(',
        ']': '[',
        '}': '{'
    };        
    const openingBrackets = new Set(['(', '[', '{']);
    const stack = [];
    
    for (let i = 0; i < s.length; i++) {
        const char = s[i];        
        if (openingBrackets.has(char)) {
            stack.push(char);
        } 
        else if (matchingBracket[char]) {
            // Если стек пуст или верхушка стека не соответствует
            if (stack.length === 0 || stack[stack.length - 1] !== matchingBracket[char]) {
                return false;
            }
            // Удаляем последнюю открывающую скобку (всё правильно)
            stack.pop();
        }
    
        else {
            return false;
        }
    }
    
    // В конце стек должен быть пустым
    return stack.length === 0;
}

const testCases = [
    { input: "()", expected: true },
    { input: "()[]{}", expected: true },
    { input: "(]", expected: false },
    { input: "([)]", expected: false },
    { input: "{[]}", expected: true },
    { input: "", expected: true },
    { input: "(", expected: false },
    { input: ")", expected: false },
    { input: "{[()]}", expected: true },
    { input: "((()))", expected: true },
    { input: "((())", expected: false },
    { input: "({[]})", expected: true },
    { input: "({[}])", expected: false },
];

function runTests() {
    let passed = 0;
    
    testCases.forEach(({ input, expected }, index) => {
        const result = isValidBrackets(input);            
        console.log(`Тест ${index + 1}: "${input}" → ${result} (ожидалось: ${expected})`);
        
        if (result === expected) passed++;
    });
    
    console.log(`\nРезультат: ${passed}/${testCases.length} тестов пройдено`);
}

runTests();