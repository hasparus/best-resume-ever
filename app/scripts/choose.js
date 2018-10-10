const { execSync } = require('child_process');
const program = require('commander');

const interleave = (strings, ...interpolations) => {
  const result = [strings[0]];

  for (let i = 0, len = interpolations.length; i < len; i += 1) {
    result.push(interpolations[i], strings[i + 1]);
  }

  return result;
};

const exec = (...args) => {
  return interleave(...args)
    .join('')
    .trim()
    .split('\n')
    .map(x => execSync(x, { stdio: 'inherit' }));
};
program
  .arguments('<pdfLocation>')
  .option('-t, --tag <string>', 'string to use as lightweight tag')
  .parse(process.argv);

const [filePath] = program.args;
const { tag } = program;

if (!filePath) {
  throw new Error(
    'filePath as first positional argument is required. Try `yarn choose -h`.'
  );
}
if (!tag) {
  throw new Error('tag is missing. Try `yarn choose -h`.');
}

exec`
  cp ${filePath} ../resume.pdf
  git tag ${tag}
  git push origin ${tag}
`;
