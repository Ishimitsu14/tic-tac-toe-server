import fs from 'fs';
import { camelToKebab } from '@utils/cases';

const iterator = (fullPath: string, relativePath: string, app: any) => {
  const items = fs.readdirSync(fullPath);
  for (const item of items) {
    if (fs.lstatSync(`${fullPath}/${item}`).isFile()) {
      const words = item.split(/(?=[A-Z])/);
      const routePath = camelToKebab(words.splice(0, words.length - 1).join(''));
      if (words[words.length - 1] === 'Controller.ts') {
        const Controller = require(`${fullPath}/${item}`);
        for (const action in Controller) {
          for (const method in Controller[action]) {
            app[method](
              `${relativePath}/${routePath}/${camelToKebab(action)}`,
              ...Controller[action][method],
            );
          }
        }
      }
    } else {
      iterator(`${fullPath}/${item}`, `${relativePath}/${item}`, app);
    }
  }
};

export default async (app: any) => {
  iterator(`${__dirname}/routes`, '', app);
};
