const compareArrays = (arr1: [], arr2: []) => {
    const difference: [] = [];

    const longest = arr1.length >= arr2.length ? arr1: arr2;
    const shortest = arr1.length <= arr2.length ? arr1: arr2;

    let result = true;

    longest.forEach((el, i) => {
       if(!shortest.includes(el)) {
        difference.push(el);
        result = false;
       }
    });

    return {result, difference};
};

export default compareArrays;