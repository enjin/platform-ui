import { marked, Renderer } from 'marked';
import DOMPurify from 'dompurify';

const renderer = new Renderer();

marked.setOptions({
    renderer: {
        br: renderer.br,
        checkbox: () => `<span>[[Checkbox is not supported]]</span>`,
        link: renderer.link,
        list: renderer.list,
        del: renderer.del,
        em: renderer.em,
        paragraph: renderer.paragraph,
        strong: renderer.strong,
        listitem: renderer.listitem,
        text: renderer.text,
        code: (text) => `<span>${text}</span>`,
        codespan: (text) => `<span>${text}</span>`,
        blockquote: (text) => `<span>${text}</span>`,
        image: () => `<span>[[Image is not supported]]</span>`,
        table: () => `<span>[[Table is not supported]]</span>`,
        html: () => `<span>[[HTML is not supported]]</span>`,
        heading: (text) => `<p>${text}</p>`,
        tablecell: () => ``,
        tablerow: () => ``,
        hr: () => ``,
        options: renderer.options,
    },
});

export const renderMarkdown = (html: string) => DOMPurify.sanitize(marked(html));
