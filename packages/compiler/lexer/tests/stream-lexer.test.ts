import { test, describe } from 'node:test';
import assert from 'node:assert';
import { LMStreamLexer } from '../stream-lexer';
import { LMBlockEventType } from '../stream-types';

describe('LMStreamLexer', () => {
  test('1. Normal HTML block', () => {
    const lexer = new LMStreamLexer();
    const input = '<HTML>\ndi(cs(hero)\n  h1(Leveonas)\n  bo(Get Started)\n)\n</HTML>';
    const events = [...lexer.push(input), ...lexer.end()];

    const starts = events.filter((e) => e.type === LMBlockEventType.BLOCK_START);
    const contents = events.filter((e) => e.type === LMBlockEventType.BLOCK_CONTENT);
    const ends = events.filter((e) => e.type === LMBlockEventType.BLOCK_END);

    assert.strictEqual(starts.length, 1);
    assert.strictEqual(starts[0].language, 'HTML');
    assert.strictEqual(starts[0].isKnown, true);

    const fullContent = contents.map((c: any) => c.content).join('');
    assert.strictEqual(
      fullContent,
      '\ndi(cs(hero)\n  h1(Leveonas)\n  bo(Get Started)\n)\n'
    );

    assert.strictEqual(ends.length, 1);
    assert.strictEqual(ends[0].language, 'HTML');
  });

  test('2. Normal CSS block', () => {
    const lexer = new LMStreamLexer();
    const input = '<CSS>\nhero{background:#071a12;padding:80px}\nh1{font-size:48px}\n</CSS>';
    const events = [...lexer.push(input), ...lexer.end()];

    const starts = events.filter((e) => e.type === LMBlockEventType.BLOCK_START);
    const contents = events.filter((e) => e.type === LMBlockEventType.BLOCK_CONTENT);
    const ends = events.filter((e) => e.type === LMBlockEventType.BLOCK_END);

    assert.strictEqual(starts.length, 1);
    assert.strictEqual(starts[0].language, 'CSS');
    const fullContent = contents.map((c: any) => c.content).join('');
    assert.strictEqual(
      fullContent,
      '\nhero{background:#071a12;padding:80px}\nh1{font-size:48px}\n'
    );
    assert.strictEqual(ends.length, 1);
    assert.strictEqual(ends[0].language, 'CSS');
  });

  test('3. Normal JS block', () => {
    const lexer = new LMStreamLexer();
    const input = '<JS>\ndocument.querySelector(".primary").onclick=()=>alert("Hello");\n</JS>';
    const events = [...lexer.push(input), ...lexer.end()];

    const starts = events.filter((e) => e.type === LMBlockEventType.BLOCK_START);
    const contents = events.filter((e) => e.type === LMBlockEventType.BLOCK_CONTENT);
    const ends = events.filter((e) => e.type === LMBlockEventType.BLOCK_END);

    assert.strictEqual(starts.length, 1);
    assert.strictEqual(starts[0].language, 'JS');
    const fullContent = contents.map((c: any) => c.content).join('');
    assert.strictEqual(
      fullContent,
      '\ndocument.querySelector(".primary").onclick=()=>alert("Hello");\n'
    );
    assert.strictEqual(ends.length, 1);
  });

  test('4. React block', () => {
    const lexer = new LMStreamLexer();
    const input = '<REACT>\ndi(cs(container) h1(React LM))\n</REACT>';
    const events = [...lexer.push(input), ...lexer.end()];

    const starts = events.filter((e) => e.type === LMBlockEventType.BLOCK_START);
    assert.strictEqual(starts.length, 1);
    assert.strictEqual(starts[0].language, 'REACT');
    assert.strictEqual(starts[0].isKnown, true);
  });

  test('5. TypeScript block', () => {
    const lexer = new LMStreamLexer();
    const input = '<TS>\ninterface User { id: string; name: string; }\n</TS>';
    const events = [...lexer.push(input), ...lexer.end()];

    const starts = events.filter((e) => e.type === LMBlockEventType.BLOCK_START);
    assert.strictEqual(starts.length, 1);
    assert.strictEqual(starts[0].language, 'TS');
    const contents = events.filter((e) => e.type === LMBlockEventType.BLOCK_CONTENT);
    assert.strictEqual(
      contents.map((c: any) => c.content).join(''),
      '\ninterface User { id: string; name: string; }\n'
    );
  });

  test('6. Tailwind block', () => {
    const lexer = new LMStreamLexer();
    const input = '<TAILWIND>\n@utility hero-glow { box-shadow: 0 0 20px #10b981; }\n</TAILWIND>';
    const events = [...lexer.push(input), ...lexer.end()];

    const starts = events.filter((e) => e.type === LMBlockEventType.BLOCK_START);
    assert.strictEqual(starts.length, 1);
    assert.strictEqual(starts[0].language, 'TAILWIND');
  });

  test('7. Multiple blocks in single chunk', () => {
    const lexer = new LMStreamLexer();
    const input = '<HTML>di(cs(p) Hello)</HTML><CSS>.p{color:red}</CSS><JS>console.log(1)</JS>';
    const events = [...lexer.push(input), ...lexer.end()];

    const starts = events.filter((e) => e.type === LMBlockEventType.BLOCK_START);
    const ends = events.filter((e) => e.type === LMBlockEventType.BLOCK_END);

    assert.strictEqual(starts.length, 3);
    assert.strictEqual(starts[0].language, 'HTML');
    assert.strictEqual(starts[1].language, 'CSS');
    assert.strictEqual(starts[2].language, 'JS');

    assert.strictEqual(ends.length, 3);
    assert.strictEqual(ends[0].language, 'HTML');
    assert.strictEqual(ends[1].language, 'CSS');
    assert.strictEqual(ends[2].language, 'JS');
  });

  test('8. Boundary split character-by-character', () => {
    const lexer = new LMStreamLexer();
    const input = '<HTML>hello</HTML>';
    const allEvents: any[] = [];

    for (const char of input) {
      const evs = lexer.push(char);
      allEvents.push(...evs);
    }
    allEvents.push(...lexer.end());

    const starts = allEvents.filter((e) => e.type === LMBlockEventType.BLOCK_START);
    const contents = allEvents.filter((e) => e.type === LMBlockEventType.BLOCK_CONTENT);
    const ends = allEvents.filter((e) => e.type === LMBlockEventType.BLOCK_END);

    assert.strictEqual(starts.length, 1);
    assert.strictEqual(starts[0].language, 'HTML');
    assert.strictEqual(contents.map((c) => c.content).join(''), 'hello');
    assert.strictEqual(ends.length, 1);
    assert.strictEqual(ends[0].language, 'HTML');
  });

  test('9. Boundary split randomly across chunks', () => {
    const lexer = new LMStreamLexer();
    const chunks = ['<HT', 'ML>\ndi(cs(hero))\n', '</HT', 'ML>'];
    const allEvents: any[] = [];

    for (const chunk of chunks) {
      allEvents.push(...lexer.push(chunk));
    }
    allEvents.push(...lexer.end());

    const starts = allEvents.filter((e) => e.type === LMBlockEventType.BLOCK_START);
    const contents = allEvents.filter((e) => e.type === LMBlockEventType.BLOCK_CONTENT);
    const ends = allEvents.filter((e) => e.type === LMBlockEventType.BLOCK_END);

    assert.strictEqual(starts.length, 1);
    assert.strictEqual(starts[0].language, 'HTML');
    assert.strictEqual(contents.map((c) => c.content).join(''), '\ndi(cs(hero))\n');
    assert.strictEqual(ends.length, 1);
  });

  test('10. Closing boundary split across chunks with misleading prefixes', () => {
    const lexer = new LMStreamLexer();
    // Chunks where '</' occurs in text, but isn't the closing tag
    const chunks = [
      '<HTML>',
      'di(text: "</div is not close tag">',
      ' but ',
      '</HT',
      'TP> is not close tag',
      ' finally </HT',
      'ML>',
    ];

    const allEvents: any[] = [];
    for (const chunk of chunks) {
      allEvents.push(...lexer.push(chunk));
    }
    allEvents.push(...lexer.end());

    const starts = allEvents.filter((e) => e.type === LMBlockEventType.BLOCK_START);
    const contents = allEvents.filter((e) => e.type === LMBlockEventType.BLOCK_CONTENT);
    const ends = allEvents.filter((e) => e.type === LMBlockEventType.BLOCK_END);

    assert.strictEqual(starts.length, 1);
    assert.strictEqual(ends.length, 1);
    const expected =
      'di(text: "</div is not close tag"> but </HTTP> is not close tag finally ';
    assert.strictEqual(contents.map((c) => c.content).join(''), expected);
  });

  test('11. Empty block', () => {
    const lexer = new LMStreamLexer();
    const input = '<HTML></HTML><CSS></CSS>';
    const events = [...lexer.push(input), ...lexer.end()];

    const starts = events.filter((e) => e.type === LMBlockEventType.BLOCK_START);
    const contents = events.filter((e) => e.type === LMBlockEventType.BLOCK_CONTENT);
    const ends = events.filter((e) => e.type === LMBlockEventType.BLOCK_END);

    assert.strictEqual(starts.length, 2);
    assert.strictEqual(contents.length, 0);
    assert.strictEqual(ends.length, 2);
  });

  test('12. Unknown block handling', () => {
    const lexer = new LMStreamLexer({ allowCustomLanguages: true });
    const input = '<CUSTOM_SHADER>gl_FragColor = vec4(1.0);</CUSTOM_SHADER>';
    const events = [...lexer.push(input), ...lexer.end()];

    const starts = events.filter((e) => e.type === LMBlockEventType.BLOCK_START);
    assert.strictEqual(starts.length, 1);
    assert.strictEqual(starts[0].language, 'CUSTOM_SHADER');
    assert.strictEqual(starts[0].isKnown, false);

    const contents = events.filter((e) => e.type === LMBlockEventType.BLOCK_CONTENT);
    assert.strictEqual(contents[0].content, 'gl_FragColor = vec4(1.0);');
  });

  test('13. Missing closing boundary (unclosed block on stream end)', () => {
    const lexer = new LMStreamLexer();
    const input = '<HTML>\ndi(cs(hero)\n  h1(Leveonas)';
    const events = [...lexer.push(input), ...lexer.end()];

    const starts = events.filter((e) => e.type === LMBlockEventType.BLOCK_START);
    const contents = events.filter((e) => e.type === LMBlockEventType.BLOCK_CONTENT);
    const errors = events.filter((e) => e.type === LMBlockEventType.ERROR);
    const streamEnds = events.filter((e) => e.type === LMBlockEventType.STREAM_END);

    assert.strictEqual(starts.length, 1);
    assert.strictEqual(
      contents.map((c: any) => c.content).join(''),
      '\ndi(cs(hero)\n  h1(Leveonas)'
    );
    assert.strictEqual(errors.length, 1);
    assert.strictEqual(errors[0].code, 'UNCLOSED_BLOCK');
    assert.strictEqual(streamEnds.length, 1);
    assert.strictEqual(streamEnds[0].incompleteBlock, 'HTML');
  });

  test('14. Large streaming input', () => {
    const lexer = new LMStreamLexer();
    const repeatCount = 500;
    const body = 'di(cs(row) p(Item)) '.repeat(repeatCount);
    const input = `<HTML>${body}</HTML>`;

    // Stream in chunks of 57 chars
    const allEvents: any[] = [];
    for (let i = 0; i < input.length; i += 57) {
      allEvents.push(...lexer.push(input.slice(i, i + 57)));
    }
    allEvents.push(...lexer.end());

    const contents = allEvents.filter((e) => e.type === LMBlockEventType.BLOCK_CONTENT);
    assert.strictEqual(contents.map((c) => c.content).join(''), body);
  });

  test('15. JavaScript containing non-matching tags as content', () => {
    const lexer = new LMStreamLexer();
    const jsContent = `
const template = "<HTML><div class='test'>Hello</div></HTML>";
const msg = "</SCRIPT> </DIV> </HTML> are just strings inside JS";
console.log(template, msg);
`;
    const input = `<JS>${jsContent}</JS>`;
    const events = [...lexer.push(input), ...lexer.end()];

    const starts = events.filter((e) => e.type === LMBlockEventType.BLOCK_START);
    const contents = events.filter((e) => e.type === LMBlockEventType.BLOCK_CONTENT);
    const ends = events.filter((e) => e.type === LMBlockEventType.BLOCK_END);

    assert.strictEqual(starts.length, 1);
    assert.strictEqual(starts[0].language, 'JS');
    assert.strictEqual(contents.map((c: any) => c.content).join(''), jsContent);
    assert.strictEqual(ends.length, 1);
    assert.strictEqual(ends[0].language, 'JS');
  });

  test('16. Whitespace between blocks', () => {
    const lexer = new LMStreamLexer();
    const input = `
<HTML>
di(Hello)
</HTML>

  \t\n
<CSS>
.hero{color:blue}
</CSS>
`;
    const events = [...lexer.push(input), ...lexer.end()];
    const starts = events.filter((e) => e.type === LMBlockEventType.BLOCK_START);
    const ends = events.filter((e) => e.type === LMBlockEventType.BLOCK_END);

    assert.strictEqual(starts.length, 2);
    assert.strictEqual(ends.length, 2);
  });

  test('17. Repeated blocks of the same language', () => {
    const lexer = new LMStreamLexer();
    const input = '<HTML>di(Block 1)</HTML><HTML>di(Block 2)</HTML>';
    const events = [...lexer.push(input), ...lexer.end()];

    const starts = events.filter((e) => e.type === LMBlockEventType.BLOCK_START);
    const contents = events.filter((e) => e.type === LMBlockEventType.BLOCK_CONTENT);

    assert.strictEqual(starts.length, 2);
    assert.strictEqual(contents[0].content, 'di(Block 1)');
    assert.strictEqual(contents[1].content, 'di(Block 2)');
  });

  test('18. Unicode content', () => {
    const lexer = new LMStreamLexer();
    const unicodeContent = 'di(cs(greeting) 🚀 こんにちは 世界 — 🌟 Leveonas)';
    const input = `<HTML>${unicodeContent}</HTML>`;

    // Stream character by character
    const allEvents: any[] = [];
    for (const char of input) {
      allEvents.push(...lexer.push(char));
    }
    allEvents.push(...lexer.end());

    const contents = allEvents.filter((e) => e.type === LMBlockEventType.BLOCK_CONTENT);
    assert.strictEqual(contents.map((c) => c.content).join(''), unicodeContent);
  });

  test('19. Nested HTML-LM parentheses', () => {
    const lexer = new LMStreamLexer();
    const nestedLM = `
di(cs(card)
  di(cs(content)
    h1(Hello)
    p(World (with (nested (parens))))
  )
)
`;
    const input = `<HTML>${nestedLM}</HTML>`;
    const events = [...lexer.push(input), ...lexer.end()];

    const contents = events.filter((e) => e.type === LMBlockEventType.BLOCK_CONTENT);
    assert.strictEqual(contents.map((c: any) => c.content).join(''), nestedLM);
  });

  describe('Language-Agnostic Framing & False Boundary Protection', () => {
    test('1. Non-matching closing tag </HTML> inside <JS> remains content', () => {
      const lexer = new LMStreamLexer();
      const input = '<JS>\nconst x = "</HTML>";\n</JS>';
      const events = [...lexer.push(input), ...lexer.end()];

      const starts = events.filter((e) => e.type === LMBlockEventType.BLOCK_START);
      const contents = events.filter((e) => e.type === LMBlockEventType.BLOCK_CONTENT);
      const ends = events.filter((e) => e.type === LMBlockEventType.BLOCK_END);

      assert.strictEqual(starts.length, 1);
      assert.strictEqual(starts[0].language, 'JS');
      assert.strictEqual(ends.length, 1);
      assert.strictEqual(ends[0].language, 'JS');

      const fullContent = contents.map((c: any) => c.content).join('');
      assert.strictEqual(fullContent, '\nconst x = "</HTML>";\n');
    });

    test('2. Non-matching closing tag </JS> inside <HTML> remains content', () => {
      const lexer = new LMStreamLexer();
      const input = '<HTML>\np("</JS>")\n</HTML>';
      const events = [...lexer.push(input), ...lexer.end()];

      const starts = events.filter((e) => e.type === LMBlockEventType.BLOCK_START);
      const contents = events.filter((e) => e.type === LMBlockEventType.BLOCK_CONTENT);
      const ends = events.filter((e) => e.type === LMBlockEventType.BLOCK_END);

      assert.strictEqual(starts.length, 1);
      assert.strictEqual(starts[0].language, 'HTML');
      assert.strictEqual(ends.length, 1);
      assert.strictEqual(ends[0].language, 'HTML');

      const fullContent = contents.map((c: any) => c.content).join('');
      assert.strictEqual(fullContent, '\np("</JS>")\n');
    });

    test('3. Non-matching closing tags </CSS>, </DIV>, </SCRIPT> inside various blocks', () => {
      const lexer = new LMStreamLexer();
      const input = `
<CSS>
/* </HTML> </JS> </DIV> </SCRIPT> in CSS comment */
.button::after { content: "</HTML>"; }
</CSS>
`.trim();
      const events = [...lexer.push(input), ...lexer.end()];

      const starts = events.filter((e) => e.type === LMBlockEventType.BLOCK_START);
      const contents = events.filter((e) => e.type === LMBlockEventType.BLOCK_CONTENT);
      const ends = events.filter((e) => e.type === LMBlockEventType.BLOCK_END);

      assert.strictEqual(starts.length, 1);
      assert.strictEqual(starts[0].language, 'CSS');
      assert.strictEqual(ends.length, 1);
      assert.strictEqual(ends[0].language, 'CSS');

      const fullContent = contents.map((c: any) => c.content).join('');
      assert.strictEqual(
        fullContent,
        '\n/* </HTML> </JS> </DIV> </SCRIPT> in CSS comment */\n.button::after { content: "</HTML>"; }\n'
      );
    });

    test('4. HTML-LM quotes (double, single, backtick) preserved as exact content', () => {
      const lexer = new LMStreamLexer();
      const input = `
<HTML>
p(He said "hello")
p(She said 'hello')
p(\`hello\`)
</HTML>
`.trim();
      const events = [...lexer.push(input), ...lexer.end()];

      const starts = events.filter((e) => e.type === LMBlockEventType.BLOCK_START);
      const contents = events.filter((e) => e.type === LMBlockEventType.BLOCK_CONTENT);
      const ends = events.filter((e) => e.type === LMBlockEventType.BLOCK_END);

      assert.strictEqual(starts.length, 1);
      assert.strictEqual(starts[0].language, 'HTML');
      assert.strictEqual(ends.length, 1);
      assert.strictEqual(ends[0].language, 'HTML');

      const fullContent = contents.map((c: any) => c.content).join('');
      const expectedContent =
        '\np(He said "hello")\np(She said \'hello\')\np(`hello`)\n';
      assert.strictEqual(fullContent, expectedContent);
    });

    test('5. HTML-LM unmatched quote does NOT prevent </HTML> from being recognized', () => {
      const lexer = new LMStreamLexer();
      const input = '<HTML>\np(He said "hello)\n</HTML>';
      const events = [...lexer.push(input), ...lexer.end()];

      const starts = events.filter((e) => e.type === LMBlockEventType.BLOCK_START);
      const contents = events.filter((e) => e.type === LMBlockEventType.BLOCK_CONTENT);
      const ends = events.filter((e) => e.type === LMBlockEventType.BLOCK_END);

      assert.strictEqual(starts.length, 1);
      assert.strictEqual(starts[0].language, 'HTML');
      assert.strictEqual(ends.length, 1);
      assert.strictEqual(ends[0].language, 'HTML');

      const fullContent = contents.map((c: any) => c.content).join('');
      assert.strictEqual(fullContent, '\np(He said "hello)\n');
    });

    test('6. HTML-LM multiple unmatched quotes and apostrophes do NOT break block boundary', () => {
      const lexer = new LMStreamLexer();
      const input = `<HTML>
p(He said "hello)
p(It's a great day)
p(\`unterminated backtick
</HTML>`;
      const events = [...lexer.push(input), ...lexer.end()];

      const starts = events.filter((e) => e.type === LMBlockEventType.BLOCK_START);
      const contents = events.filter((e) => e.type === LMBlockEventType.BLOCK_CONTENT);
      const ends = events.filter((e) => e.type === LMBlockEventType.BLOCK_END);

      assert.strictEqual(starts.length, 1);
      assert.strictEqual(starts[0].language, 'HTML');
      assert.strictEqual(ends.length, 1);
      assert.strictEqual(ends[0].language, 'HTML');

      const fullContent = contents.map((c: any) => c.content).join('');
      const expectedContent = `\np(He said "hello)\np(It's a great day)\np(\`unterminated backtick\n`;
      assert.strictEqual(fullContent, expectedContent);
    });

    test('7. Boundary split incrementally across stream chunks', () => {
      const lexer = new LMStreamLexer();
      const chunks = [
        '<HTML>\n',
        'p(He said "hello")\n',
        '</HT',
        'ML>',
      ];

      const events: any[] = [];
      for (const chunk of chunks) {
        events.push(...lexer.push(chunk));
      }
      events.push(...lexer.end());

      const starts = events.filter((e) => e.type === LMBlockEventType.BLOCK_START);
      const contents = events.filter((e) => e.type === LMBlockEventType.BLOCK_CONTENT);
      const ends = events.filter((e) => e.type === LMBlockEventType.BLOCK_END);

      assert.strictEqual(starts.length, 1);
      assert.strictEqual(starts[0].language, 'HTML');
      assert.strictEqual(ends.length, 1);
      assert.strictEqual(ends[0].language, 'HTML');
      assert.strictEqual(
        contents.map((c: any) => c.content).join(''),
        '\np(He said "hello")\n'
      );
    });
  });

  describe('Randomized Chunk Tests Across Supported Languages', () => {
    test('1. HTML randomized chunk streaming (1-20 chars)', () => {
      const htmlDoc = `<HTML>
di(cs(hero-container)
  he(
    h1(Leveonas Engine)
    p(He said "Welcome to LM v1" and smiled)
    p(She replied 'It\\'s ultra fast!')
    p(\`Backticks work naturally\`)
  )
  bo(cs(btn-primary) id(start-btn) Get Started)
)
</HTML>`;

      for (let iter = 0; iter < 25; iter++) {
        const lexer = new LMStreamLexer();
        const events: any[] = [];
        let offset = 0;

        while (offset < htmlDoc.length) {
          const chunkSize = 1 + ((offset * 13 + iter * 7) % 20);
          const chunk = htmlDoc.slice(offset, offset + chunkSize);
          offset += chunkSize;
          events.push(...lexer.push(chunk));
        }
        events.push(...lexer.end());

        const starts = events.filter((e) => e.type === LMBlockEventType.BLOCK_START);
        const contents = events.filter((e) => e.type === LMBlockEventType.BLOCK_CONTENT);
        const ends = events.filter((e) => e.type === LMBlockEventType.BLOCK_END);

        assert.strictEqual(starts.length, 1, `HTML iter ${iter} start length`);
        assert.strictEqual(starts[0].language, 'HTML');
        assert.strictEqual(ends.length, 1, `HTML iter ${iter} end length`);
        assert.strictEqual(ends[0].language, 'HTML');

        const reconstructed = contents.map((c: any) => c.content).join('');
        const expected = htmlDoc.replace('<HTML>', '').replace('</HTML>', '');
        assert.strictEqual(reconstructed, expected);
      }
    });

    test('2. CSS randomized chunk streaming (1-20 chars)', () => {
      const cssDoc = `<CSS>
.hero-container {
  background: #071a12;
  padding: 80px 20px;
  color: #f0fdf4;
}
/* Comment with </HTML> and </JS> */
.btn-primary:hover {
  background: #16a34a;
  content: "</CSS-not-real>";
}
</CSS>`;

      for (let iter = 0; iter < 25; iter++) {
        const lexer = new LMStreamLexer();
        const events: any[] = [];
        let offset = 0;

        while (offset < cssDoc.length) {
          const chunkSize = 1 + ((offset * 11 + iter * 17) % 20);
          const chunk = cssDoc.slice(offset, offset + chunkSize);
          offset += chunkSize;
          events.push(...lexer.push(chunk));
        }
        events.push(...lexer.end());

        const starts = events.filter((e) => e.type === LMBlockEventType.BLOCK_START);
        const contents = events.filter((e) => e.type === LMBlockEventType.BLOCK_CONTENT);
        const ends = events.filter((e) => e.type === LMBlockEventType.BLOCK_END);

        assert.strictEqual(starts.length, 1, `CSS iter ${iter} start length`);
        assert.strictEqual(starts[0].language, 'CSS');
        assert.strictEqual(ends.length, 1, `CSS iter ${iter} end length`);
        assert.strictEqual(ends[0].language, 'CSS');

        const reconstructed = contents.map((c: any) => c.content).join('');
        const expected = cssDoc.replace('<CSS>', '').replace('</CSS>', '');
        assert.strictEqual(reconstructed, expected);
      }
    });

    test('3. JS randomized chunk streaming (1-20 chars)', () => {
      const jsDoc = `<JS>
// Comment with </HTML> and </CSS>
const template = "<HTML><div>Hello</div></HTML>";
document.querySelector("#start-btn").addEventListener("click", () => {
  console.log("Clicked:", template);
});
</JS>`;

      for (let iter = 0; iter < 25; iter++) {
        const lexer = new LMStreamLexer();
        const events: any[] = [];
        let offset = 0;

        while (offset < jsDoc.length) {
          const chunkSize = 1 + ((offset * 19 + iter * 23) % 20);
          const chunk = jsDoc.slice(offset, offset + chunkSize);
          offset += chunkSize;
          events.push(...lexer.push(chunk));
        }
        events.push(...lexer.end());

        const starts = events.filter((e) => e.type === LMBlockEventType.BLOCK_START);
        const contents = events.filter((e) => e.type === LMBlockEventType.BLOCK_CONTENT);
        const ends = events.filter((e) => e.type === LMBlockEventType.BLOCK_END);

        assert.strictEqual(starts.length, 1, `JS iter ${iter} start length`);
        assert.strictEqual(starts[0].language, 'JS');
        assert.strictEqual(ends.length, 1, `JS iter ${iter} end length`);
        assert.strictEqual(ends[0].language, 'JS');

        const reconstructed = contents.map((c: any) => c.content).join('');
        const expected = jsDoc.replace('<JS>', '').replace('</JS>', '');
        assert.strictEqual(reconstructed, expected);
      }
    });

    test('4. REACT randomized chunk streaming (1-20 chars)', () => {
      const reactDoc = `<REACT>
di(cs(flex flex-col items-center p-6 bg-slate-900 text-white)
  h1(cs(text-3xl font-bold text-emerald-400) Leveonas Next)
  p(cs(text-slate-300 mt-2) Streaming LM directly into React components)
  bo(cs(px-4 py-2 bg-emerald-500 rounded) oc(handleClick) Click Me)
)
</REACT>`;

      for (let iter = 0; iter < 25; iter++) {
        const lexer = new LMStreamLexer();
        const events: any[] = [];
        let offset = 0;

        while (offset < reactDoc.length) {
          const chunkSize = 1 + ((offset * 7 + iter * 31) % 20);
          const chunk = reactDoc.slice(offset, offset + chunkSize);
          offset += chunkSize;
          events.push(...lexer.push(chunk));
        }
        events.push(...lexer.end());

        const starts = events.filter((e) => e.type === LMBlockEventType.BLOCK_START);
        const contents = events.filter((e) => e.type === LMBlockEventType.BLOCK_CONTENT);
        const ends = events.filter((e) => e.type === LMBlockEventType.BLOCK_END);

        assert.strictEqual(starts.length, 1, `React iter ${iter} start length`);
        assert.strictEqual(starts[0].language, 'REACT');
        assert.strictEqual(ends.length, 1, `React iter ${iter} end length`);
        assert.strictEqual(ends[0].language, 'REACT');

        const reconstructed = contents.map((c: any) => c.content).join('');
        const expected = reactDoc.replace('<REACT>', '').replace('</REACT>', '');
        assert.strictEqual(reconstructed, expected);
      }
    });

    test('5. TS randomized chunk streaming (1-20 chars)', () => {
      const tsDoc = `<TS>
import React, { useState } from 'react';

export interface ButtonProps<T = string> {
  label: T;
  onClick: (val: T) => void;
  disabled?: boolean;
}

export function ActionButton({ label, onClick }: ButtonProps) {
  const [active, setActive] = useState<boolean>(false);
  return { active, label };
}
</TS>`;

      for (let iter = 0; iter < 25; iter++) {
        const lexer = new LMStreamLexer();
        const events: any[] = [];
        let offset = 0;

        while (offset < tsDoc.length) {
          const chunkSize = 1 + ((offset * 17 + iter * 29) % 20);
          const chunk = tsDoc.slice(offset, offset + chunkSize);
          offset += chunkSize;
          events.push(...lexer.push(chunk));
        }
        events.push(...lexer.end());

        const starts = events.filter((e) => e.type === LMBlockEventType.BLOCK_START);
        const contents = events.filter((e) => e.type === LMBlockEventType.BLOCK_CONTENT);
        const ends = events.filter((e) => e.type === LMBlockEventType.BLOCK_END);

        assert.strictEqual(starts.length, 1, `TS iter ${iter} start length`);
        assert.strictEqual(starts[0].language, 'TS');
        assert.strictEqual(ends.length, 1, `TS iter ${iter} end length`);
        assert.strictEqual(ends[0].language, 'TS');

        const reconstructed = contents.map((c: any) => c.content).join('');
        const expected = tsDoc.replace('<TS>', '').replace('</TS>', '');
        assert.strictEqual(reconstructed, expected);
      }
    });

    test('6. Multi-language document with interleaved false tags and random chunks (1-20 chars)', () => {
      const multiDoc = `<HTML>
di(cs(hero)
  h1(Hello World)
  p(He said "Hello </JS> and </CSS>" with confidence)
  p(Escaped markup \\</HTML\\>)
)
</HTML>

<CSS>
/* Comment with </HTML> and </REACT> */
.hero {
  color: #fff;
  content: "</HTML>";
}
</CSS>

<JS>
const sampleHtml = "<HTML><span>test</span></HTML>";
console.log(sampleHtml, "</CSS>");
</JS>

<REACT>
di(cs(card)
  p(React template with '</HTML>' as text)
)
</REACT>

<TS>
export type Guard = "<HTML>" | "</HTML>";
export const val: Guard = "</HTML>";
</TS>`;

      for (let iter = 0; iter < 30; iter++) {
        const lexer = new LMStreamLexer();
        const events: any[] = [];
        let offset = 0;

        while (offset < multiDoc.length) {
          const chunkSize = 1 + ((offset * 23 + iter * 41) % 20);
          const chunk = multiDoc.slice(offset, offset + chunkSize);
          offset += chunkSize;
          events.push(...lexer.push(chunk));
        }
        events.push(...lexer.end());

        const starts = events.filter((e) => e.type === LMBlockEventType.BLOCK_START);
        const ends = events.filter((e) => e.type === LMBlockEventType.BLOCK_END);

        assert.strictEqual(starts.length, 5, `Multi-doc iter ${iter} starts`);
        assert.strictEqual(ends.length, 5, `Multi-doc iter ${iter} ends`);
        assert.strictEqual(starts[0].language, 'HTML');
        assert.strictEqual(starts[1].language, 'CSS');
        assert.strictEqual(starts[2].language, 'JS');
        assert.strictEqual(starts[3].language, 'REACT');
        assert.strictEqual(starts[4].language, 'TS');

        assert.strictEqual(ends[0].language, 'HTML');
        assert.strictEqual(ends[1].language, 'CSS');
        assert.strictEqual(ends[2].language, 'JS');
        assert.strictEqual(ends[3].language, 'REACT');
        assert.strictEqual(ends[4].language, 'TS');

        const htmlContent = events
          .filter((e) => e.type === LMBlockEventType.BLOCK_CONTENT && e.language === 'HTML')
          .map((e) => e.content)
          .join('');
        const jsContent = events
          .filter((e) => e.type === LMBlockEventType.BLOCK_CONTENT && e.language === 'JS')
          .map((e) => e.content)
          .join('');
        const tsContent = events
          .filter((e) => e.type === LMBlockEventType.BLOCK_CONTENT && e.language === 'TS')
          .map((e) => e.content)
          .join('');

        assert.ok(htmlContent.includes('p(He said "Hello </JS> and </CSS>" with confidence)'));
        assert.ok(jsContent.includes('const sampleHtml = "<HTML><span>test</span></HTML>";'));
        assert.ok(tsContent.includes('export const val: Guard = "</HTML>";'));
      }
    });
  });
});
