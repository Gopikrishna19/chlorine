const minHocl = 0.03;
const maxHocl = 0.05;
const slamHocl = 0.12;
const hoclFactor = 0.3;
const volumeFactor = 10000;

const form = document.getElementById('form');
const recommended = document.getElementById('recommended');
const addition = document.getElementById('addition');

const fixNumber = (num, decimals = 2) => Number(num.toFixed(decimals));

const updateValues = (target, { min, max, slam }) => {
    target.querySelector('.min').textContent = min;
    target.querySelector('.max').textContent = max;
    target.querySelector('.slam').textContent = slam;
};

const calculateRecommended = (cya) => {
    const min = minHocl * cya / hoclFactor;
    const max = maxHocl * cya / hoclFactor;
    const slam = slamHocl * cya / hoclFactor;

    return {
        min: fixNumber(min),
        max: fixNumber(max),
        slam: fixNumber(slam)
    };
};

const calculateChlorineAddition = (strength, cya, volume, fc) => {
    const { min: minTarget, max: maxTarget, slam: slamTarget } = calculateRecommended(cya);

    const min = Math.max(0, (minTarget - fc) * 128 / strength * volume / volumeFactor);
    const max = Math.max(0, (maxTarget - fc) * 128 / strength * volume / volumeFactor);
    const slam = Math.max(0, (slamTarget - fc) * 128 / strength * volume / volumeFactor);

    return {
        min: `${fixNumber(min)} / ${fixNumber(min / 128)}`,
        max: `${fixNumber(max)} / ${fixNumber(max / 128)}`,
        slam: `${fixNumber(slam)} / ${fixNumber(slam / 128)}`
    };
};

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const values = Object.fromEntries(new FormData(event.currentTarget, event.submitter))

    if (values.calculate === 'recommended') {
        const result = calculateRecommended(Number(values.cya));
        updateValues(recommended, result);
    } else if (values.calculate === 'addition') {
        const result = calculateChlorineAddition(
            Number(values.strength),
            Number(values.cya),
            Number(values.volume),
            Number(values.freeChlorine)
        );
        updateValues(addition, result);
    }
});

form.addEventListener('reset', (event) => {
    updateValues(recommended, { min: '', max: '', slam: '' });
    updateValues(addition, { min: '', max: '', slam: '' });
});
