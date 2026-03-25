function deepClone(source, cache = new WeakMap()) {
    // 1. Обработка примитивных типов и null/undefined
    if (source === null || typeof source !== 'object') {
        return source;
    }

    // 2. Проверка на циклические ссылки
    if (cache.has(source)) {
        return cache.get(source);
    }

    if (source instanceof Date) {
        const copy = new Date(source.getTime());
        cache.set(source, copy);
        return copy;
    }

    if (source instanceof RegExp) {
        const copy = new RegExp(source.source, source.flags);
        copy.lastIndex = source.lastIndex;
        cache.set(source, copy);
        return copy;
    }

    if (source instanceof Map) {
        const copy = new Map();
        cache.set(source, copy);
        for (const [key, value] of source) {
            copy.set(deepClone(key, cache), deepClone(value, cache));
        }
        return copy;
    }

    if (source instanceof Set) {
        const copy = new Set();
        cache.set(source, copy);
        for (const value of source) {
            copy.add(deepClone(value, cache));
        }
        return copy;
    }

    // 7. Обработка массива
    if (Array.isArray(source)) {
        const copy = [];
        cache.set(source, copy);
        for (let i = 0; i < source.length; i++) {
            copy[i] = deepClone(source[i], cache);
        }
        return copy;
    }

    const copy = Object.create(Object.getPrototypeOf(source));
    cache.set(source, copy);

    const allProps = [
        ...Object.getOwnPropertyNames(source),
        ...Object.getOwnPropertySymbols(source)
    ];

    for (const key of allProps) {
        const descriptor = Object.getOwnPropertyDescriptor(source, key);

        if (descriptor) {
            if (descriptor.get || descriptor.set) {
                Object.defineProperty(copy, key, descriptor);
            } else {
                copy[key] = deepClone(source[key], cache);
            }
        }
    }

    return copy;
}


console.log('=== 1. Базовые типы ===');
console.log('Число:', deepClone(42));
console.log('Строка:', deepClone('hello'));
console.log('Boolean:', deepClone(true));
console.log('Null:', deepClone(null));
console.log('Undefined:', deepClone(undefined));

console.log('\n=== 2. Объекты и массивы ===');
const obj = { a: 1, b: { c: 2 }, d: [1, 2, { e: 3 }] };
const clonedObj = deepClone(obj);
clonedObj.b.c = 999;
clonedObj.d[2].e = 888;
console.log('Исходный:', JSON.stringify(obj));
console.log('Копия:', JSON.stringify(clonedObj));
console.log('Изменение копии не влияет на оригинал:', obj.b.c === 2); // true

console.log('\n=== 3. Циклические ссылки ===');
const circular = { name: 'Parent' };
circular.self = circular;
circular.child = { parent: circular };
const clonedCircular = deepClone(circular);
console.log('Циклическая ссылка обработана:', clonedCircular.self === clonedCircular);
console.log('Вложенная циклическая ссылка:', clonedCircular.child.parent === clonedCircular);

console.log('\n=== 4. Date и RegExp ===');
const dateObj = { date: new Date('2024-01-01'), regex: /test/gi };
const clonedDateObj = deepClone(dateObj);
clonedDateObj.date.setFullYear(2025);
console.log('Исходная дата (год):', dateObj.date.getFullYear());
console.log('Копия даты (год):', clonedDateObj.date.getFullYear());
console.log('RegExp флаги:', clonedDateObj.regex.flags);

console.log('\n=== 5. Map и Set ===');
const mapSetObj = {
    map: new Map([
        ['a', 1],
        ['b', { nested: 2 }]
    ]),
    set: new Set([1, 2, { deep: 3 }])
};

const clonedMapSet = deepClone(mapSetObj);


console.log('clonedMapSet.map instanceof Map:', clonedMapSet.map instanceof Map);

const nestedObj = clonedMapSet.map.get('b');
if (nestedObj && typeof nestedObj === 'object') {
    nestedObj.nested = 999;
}

console.log('Исходный Map (b.nested):', mapSetObj.map.get('b').nested);
console.log('Копия Map (b.nested):', clonedMapSet.map.get('b').nested);

// Работа с Set
console.log('Исходный Set (размер):', mapSetObj.set.size);
console.log('Копия Set (размер):', clonedMapSet.set.size);

// Добавляем элемент в Set копии
clonedMapSet.set.add(999);
console.log('Исходный Set (размер после добавления в копию):', mapSetObj.set.size);
console.log('Копия Set (размер после добавления):', clonedMapSet.set.size);

console.log('\n=== 6. Символы ===');
const sym = Symbol('test');
const symbolObj = { [sym]: 'symbol value', regular: 'regular value' };
const clonedSymbolObj = deepClone(symbolObj);
console.log('✅ Символ скопирован:', clonedSymbolObj[sym] === 'symbol value');

console.log('\n=== 7. Геттеры и сеттеры ===');
const getterObj = {
    _value: 42,
    get value() { return this._value; },
    set value(v) { this._value = v; }
};
const clonedGetterObj = deepClone(getterObj);
clonedGetterObj.value = 100;
console.log('✅ Геттер скопирован (значение из копии):', clonedGetterObj.value === 100);
console.log('✅ Оригинал не изменился:', getterObj.value === 42);

console.log('\n=== 8. Прототипы и классы ===');
class Animal {
    constructor(name) { this.name = name; }
    speak() { return `${this.name} makes sound`; }
}
class Dog extends Animal {
    constructor(name) { super(name); }
    bark() { return `${this.name} barks`; }
}
const rex = new Dog('Rex');
const clonedRex = deepClone(rex);
console.log('Копия класса instanceof Dog:', clonedRex instanceof Dog);
console.log('Метод класса speak():', clonedRex.speak());
console.log('Метод наследника bark():', clonedRex.bark());

console.log('\n=== 9. Сложный вложенный объект ===');
const complex = {
    string: 'hello',
    number: 123,
    boolean: true,
    nullVal: null,
    undefinedVal: undefined,
    date: new Date(),
    regex: /pattern/g,
    array: [1, 2, { deep: 'value' }],
    nested: {
        a: 1,
        b: [1, 2, 3],
        c: { d: 4 }
    },
    map: new Map([['key', 'value']]),
    set: new Set([1, 2, 3]),
    [Symbol('id')]: 12345
};

const clonedComplex = deepClone(complex);
console.log('Типы сохранены:');
console.log('  - Date:', clonedComplex.date instanceof Date);
console.log('  - RegExp:', clonedComplex.regex instanceof RegExp);
console.log('  - Map:', clonedComplex.map instanceof Map);
console.log('  - Set:', clonedComplex.set instanceof Set);
console.log('  - Symbol:', Object.getOwnPropertySymbols(clonedComplex).length > 0);

console.log('\n=== 10. Проверка независимости копии ===');
const original = {
    primitive: 42,
    nested: { value: 10 },
    array: [1, { x: 2 }]
};

const copy = deepClone(original);
copy.primitive = 100;
copy.nested.value = 999;
copy.array[1].x = 888;
copy.array.push(777);

console.log('Исходный primitive:', original.primitive);
console.log('Копия primitive:', copy.primitive);
console.log('Исходный nested.value:', original.nested.value);
console.log('Копия nested.value:', copy.nested.value);
console.log('Исходный array[1].x:', original.array[1].x);
console.log('Копия array[1].x:', copy.array[1].x);
console.log('Исходный array.length:', original.array.length);
console.log('Копия array.length:', copy.array.length);