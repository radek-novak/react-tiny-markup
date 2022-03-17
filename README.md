# react-tiny-markup <!--![ ](https://badgen.net/bundlephobia/minzip/react-tiny-markup) -->

This component aims to parse a simple markup language nontechnical users may input - typically `<i>`, `<b>` and `<img />` tags. It will never be a complete HTML5 parser (tag nesting validation, autoclosing tags - none of that). I wanted a smaller (~3kB vs ~60+kB) alternative to [sanitize-html](https://www.npmjs.com/package/sanitize-html).

### Security:

It doesn't use `dangerouslySetInnerHTML`.

### Examples:

<!-- [Try it out](https://radek-novak.github.io/react-tiny-markup/) -->

```JSX
// replace or remove tags
const str = `
  <ooo>inner</ooo>
  <remove>invi<b>s</b>ible</remove>
  <b>left in</b>
`;
<ReactTinyMarkup
  renderer={p => {
    switch (p.tag) {
      case 'ooo':
        return createElement('c', { key: p.key }, p.children);
      case 'remove':
        return null;
      default:
        return createElement(p.tag, { key: p.key }, p.children);
    }
  }}
>
  {str}
</ReactTinyMarkup>
// <c>inner</c><b>left in</b>
```

```JSX
// simply parse tags
const str = 'abc<strong>a</strong>b<i>c</i>d<b>e</b>';
<ReactTinyMarkup>{str}</ReactTinyMarkup>
// abc<strong>a</strong>b<i>c</i>d<b>e</b>

// rewrite tag (`strong` in this case) and simply parse the rest
<ReactTinyMarkup
  renderer={p =>
    p.tag === 'strong' ? (
      <i key={p.key}>{p.children}</i>
    ) : (
      defaultRenderer(p)
    )
  }
>
  {str}
</ReactTinyMarkup>
// abc<i>a</i>b<i>c</i>d<b>e</b>
```

```JSX
// Parse tags with attributes
const str = 'Look at this <em class="red">dog</em> <img src="dog.jpg" alt="my dog" />';
<ReactTinyMarkup
  allowedAttributes={{ img: '', alt: '', class: 'className' }}
>
  {str}
</ReactTinyMarkup>
// renders
// <>Look at this <em className="red">dog</em> <img src="dog.jpg" alt="my dog" /></>
```
