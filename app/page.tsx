// app/page.tsx
'use client';

import { useState, useRef } from 'react';
import {
  Title,
  Textarea,
  Code,
  Stack,
  Button,
  Group,
  ColorPicker,
  Text,
  Anchor,
  ActionIcon,
  SimpleGrid,
} from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { IconBold, IconRefresh } from '@tabler/icons-react';

export default function Home() {
  const [inputText, setInputText] = useState<string>('hello world');
  const [color, setColor] = useState<string>('#ffffff');
  const [bgColor, setBgColor] = useState<string>('#000000');
  const [outputText, setOutputText] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const clipboard = useClipboard({ timeout: 2000 });

  // Foreground and background color options
  const fgColors = [
    '#808080', // Gray
    '#ff0000', // Red
    '#00ff00', // Green
    '#ffff00', // Yellow
    '#0000ff', // Blue
    '#ff00ff', // Magenta
    '#00ffff', // Cyan
    '#ffffff', // White
  ];

  const bgColors = [
    '#000000', // Black
    '#ff8000', // Orange
    '#808080', // Gray
    '#c0c0c0', // Light Gray
    '#800080', // Purple
    '#808080', // Gray (repeated)
    '#f0f0f0', // Light Gray
  ];

  // Hex to ANSI color code mapping
  const hexToAnsiFg = (hex: string) => {
    const colorMap: { [key: string]: string } = {
      '#808080': '90', // Gray
      '#ff0000': '91', // Red
      '#00ff00': '92', // Green
      '#ffff00': '93', // Yellow
      '#0000ff': '94', // Blue
      '#ff00ff': '95', // Magenta
      '#00ffff': '96', // Cyan
      '#ffffff': '97', // White
    };
    return colorMap[hex.toLowerCase()] || '97'; // Default to white
  };

  const hexToAnsiBg = (hex: string) => {
    const colorMap: { [key: string]: string } = {
      '#000000': '40', // Black
      '#ff8000': '41', // Orange (approximated as red in ANSI)
      '#808080': '100', // Gray
      '#c0c0c0': '47', // Light Gray
      '#800080': '45', // Purple
      '#f0f0f0': '47', // Light Gray (approximated)
    };
    return colorMap[hex.toLowerCase()] || '40'; // Default to black
  };

  const applyFormatting = (text: string, fg: string, bg: string, bold: boolean = false) => {
    const fgCode = hexToAnsiFg(fg);
    const bgCode = hexToAnsiBg(bg);
    const boldCode = bold ? '1' : '';
    const codes = [boldCode, fgCode, bgCode].filter(Boolean).join(';');
    return `\`\`\`ansi\n\x1b[${codes}m${text}\x1b[0m\n\`\`\``;
  };

  const generateDiscordText = () => {
    const selectedText = textareaRef.current?.value || inputText;
    const formattedText = applyFormatting(selectedText, color, bgColor);
    setOutputText(formattedText);
  };

  const applyBold = () => {
    const selectedText = textareaRef.current?.value || inputText;
    const formattedText = applyFormatting(selectedText, color, bgColor, true);
    setOutputText(formattedText);
  };

  const resetFormatting = () => {
    setColor('#ffffff');
    setBgColor('#000000');
    setOutputText('');
  };

  return (
    <Stack p="md" maw={600} mx="auto" my="lg">
      <Title order={1}>Rebane's Discord Colored Text Generator</Title>

      <Stack gap="xs">
        <Title order={2}>About</Title>
        <Text>
          This is a simple app that creates colored Discord messages using the ANSI color codes
          available on the latest Discord desktop versions.
        </Text>
        <Text>
          To use this, write your text, select parts of it and assign colors to them, then copy it
          using the button below, and send in a Discord message.
        </Text>
      </Stack>

      <Title order={2}>Create your text</Title>

      <Group gap="xs">
        <Button variant="outline" onClick={resetFormatting} leftSection={<IconRefresh size={16} />}>
          Reset All
        </Button>
        <Button variant="outline" onClick={applyBold} leftSection={<IconBold size={16} />}>
          Bold
        </Button>
        <Button variant="outline" disabled>
          Line
        </Button>
      </Group>

      <Textarea
        label="Your Text"
        placeholder="Enter your text here"
        value={inputText}
        onChange={(e) => setInputText(e.currentTarget.value)}
        minRows={3}
        ref={textareaRef}
      />

      <Stack gap="xs">
        <Text>FG</Text>
        <SimpleGrid cols={4}>
          {fgColors.map((fgColor) => (
            <ActionIcon
              key={fgColor}
              size="lg"
              style={{ backgroundColor: fgColor }}
              onClick={() => setColor(fgColor)}
              variant={color === fgColor ? 'filled' : 'outline'}
            />
          ))}
        </SimpleGrid>
      </Stack>

      <Stack gap="xs">
        <Text>BG</Text>
        <SimpleGrid cols={4}>
          {bgColors.map((bgColor) => (
            <ActionIcon
              key={bgColor}
              size="lg"
              style={{ backgroundColor: bgColor }}
              onClick={() => setBgColor(bgColor)}
              variant={bgColor === bgColor ? 'filled' : 'outline'}
            />
          ))}
        </SimpleGrid>
      </Stack>

      <ColorPicker
        format="hex"
        value={color}
        onChange={setColor}
        withPicker={true}
        swatchesPerRow={10}
        swatches={[]}
        styles={{
          preview: { display: 'none' },
          input: { display: 'none' },
          alphaSlider: { display: 'none' },
        }}
      />

      <Button onClick={generateDiscordText}>Generate</Button>

      {outputText && (
        <Stack gap="xs">
          <Code block>{outputText}</Code>
          <Group>
            <Button
              variant="outline"
              onClick={() => clipboard.copy(outputText)}
            >
              {clipboard.copied ? 'Copied!' : 'Copy to Clipboard'}
            </Button>
          </Group>
        </Stack>
      )}
    </Stack>
  );
}