# IngTemp

A component for...

## Features

- a
- b
- ...

## How to use

### Installation

```bash
yarn add ing-temp
```

```js
import { html, LitElement, ScopedElementsMixin } from 'ing-web';
import { IngTemp } from 'ing-temp';

class MyApp extends ScopedElementsMixin(LitElement) {
  static get scopedElements() {
    return {
      'ing-temp': IngTemp,
    };
  }

  render() {
    return html`
      <ing-temp></ing-temp>
    `;
  }
}
```

```js script
import { html, withWebComponentsKnobs, withKnobs } from '@open-wc/demoing-storybook';
import '../__element-definitions/ing-temp.js';

export default {
  title: 'IngTemp',
  component: 'ing-temp',
  decorators: [withKnobs, withWebComponentsKnobs],
  options: { selectedPanel: "storybookjs/knobs/panel" },
};
```

```js preview-story
export const Simple = () => html`
  <ing-temp></ing-temp>
`;
```

## Variations

### Custom Title

```js preview-story
export const CustomTitle = () => html`
  <ing-temp title="Hello World"></ing-temp>
`;
```
