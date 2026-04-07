function quineMcCluskey(minterms) {
    if (minterms.length === 0) return "0";
    if (minterms.length === 16) return "1";
    let numVars = 4;
    let groups = {};
    minterms.forEach(m => {
        let bin = m.toString(2).padStart(numVars, '0');
        let count = (bin.match(/1/g) || []).length;
        if (!groups[count]) groups[count] = new Set();
        groups[count].add(bin);
    });
    let primeImplicants = new Set();
    while (Object.keys(groups).length > 0) {
        let nextGroups = {};
        let combined = new Set();
        let keys = Object.keys(groups).map(Number).sort((a, b) => a - b);
        for (let i = 0; i < keys.length - 1; i++) {
            let k1 = keys[i], k2 = keys[i+1];
            if (k2 !== k1 + 1) continue;
            for (let term1 of groups[k1]) {
                for (let term2 of groups[k2]) {
                    let diffs = 0, pos = -1;
                    for (let j = 0; j < numVars; j++) {
                        if (term1[j] !== term2[j]) { diffs++; pos = j; }
                    }
                    if (diffs === 1) {
                        let res = term1.substring(0, pos) + '-' + term1.substring(pos + 1);
                        let c = (res.match(/1/g) || []).length;
                        if (!nextGroups[c]) nextGroups[c] = new Set();
                        nextGroups[c].add(res);
                        combined.add(term1); combined.add(term2);
                    }
                }
            }
        }
        for (let k in groups) {
            for (let term of groups[k]) {
                if (!combined.has(term)) primeImplicants.add(term);
            }
        }
        groups = nextGroups;
    }
    return Array.from(primeImplicants).map(pi => {
        let res = "";
        let vars = ['A', 'B', 'C', 'D'];
        for (let i = 0; i < pi.length; i++) {
            if (pi[i] === '1') res += vars[i];
            else if (pi[i] === '0') res += vars[i] + "'";
        }
        return res === "" ? "1" : res;
    }).join(" + ");
}