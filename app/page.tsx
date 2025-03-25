'use client';

import { useState, useRef } from 'react';
import {
  Title,
  Textarea,
  Code,
  Stack,
  Button,
  Group,
  Text,
  Anchor,
  ActionIcon,
  SimpleGrid,
  Box,
} from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { IconBold, IconRefresh, IconUnderline } from '@tabler/icons-react';

export default function Home() {
  const [inputText, setInputText] = useState<string>("Welcome to Rebane's Discord Colored Text Generator!");
  const [color, setColor] = useState<string>('#ffffff');
  const [bgColor, setBgColor] = useState<string>('#002b36');
  const [outputText, setOutputText] = useState<string>('');
  const [styledSegments, setStyledSegments] = useState<
    { text: string; fg: string; bg: string; bold: boolean; underline: boolean }[]
  >([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const clipboard = useClipboard({ timeout: 2000 });

  // Foreground and background color options (using provided hex values)
  const fgColors = [
    '#4f545c', // Gray (30)
    '#dc322f', // Red (31)
    '#859900', // Green (32)
    '#b58900', // Yellow (33)
    '#268bd2', // Blue (34)
    '#d33682', // Pink (35)
    '#2aa198', // Cyan (36)
    '#ffffff', // White (37)
  ];

  const bgColors = [
    '#002b36', // Firefly dark blue (40)
    '#cb4b16', // Orange (41)
    '#586e75', // Marble blue (42)
    '#657b83', // Greyish turquoise (43)
    '#839496', // Gray (44)
    '#6c71c4', // Indigo (45)
    '#93a1a1', // Light gray (46)
    '#fdf6e3', // White (47)
  ];

  // Hex to ANSI color code mapping
  const hexToAnsiFg = (hex: string) => {
    const colorMap: { [key: string]: string } = {
      '#4f545c': '30', // Gray
      '#dc322f': '31', // Red
      '#859900': '32', // Green
      '#b58900': '33', // Yellow
      '#268bd2': '34', // Blue
      '#d33682': '35', // Pink
      '#2aa198': '36', // Cyan
      '#ffffff': '37', // White
    };
    return colorMap[hex.toLowerCase()] || '37'; // Default to white
  };

  const hexToAnsiBg = (hex: string) => {
    const colorMap: { [key: string]: string } = {
      '#002b36': '40', // Firefly dark blue
      '#cb4b16': '41', // Orange
      '#586e75': '42', // Marble blue
      '#657b83': '43', // Greyish turquoise
      '#839496': '44', // Gray
      '#6c71c4': '45', // Indigo
      '#93a1a1': '46', // Light gray
      '#fdf6e3': '47', // White
    };
    return colorMap[hex.toLowerCase()] || '40'; // Default to firefly dark blue
  };

  const applyFormatting = (
    text: string,
    fg: string,
    bg: string,
    bold: boolean,
    underline: boolean,
    start: number,
    end: number
  ) => {
    // Split the text into segments: before, selected, and after
    const before = text.slice(0, start);
    const selected = text.slice(start, end);
    const after = text.slice(end);

    // Generate styled segments for preview
    const segments = [];
    if (before) {
      segments.push({ text: before, fg: '#ffffff', bg: '#002b36', bold: false, underline: false });
    }
    if (selected) {
      segments.push({ text: selected, fg, bg, bold, underline });
    }
    if (after) {
      segments.push({ text: after, fg: '#ffffff', bg: '#002b36', bold: false, underline: false });
    }

    // Generate ANSI code for Discord
    let ansiText = '```ansi\n';
    if (before) {
      ansiText += before;
    }
    if (selected) {
      const fgCode = hexToAnsiFg(fg);
      const bgCode = hexToAnsiBg(bg);
      const boldCode = bold ? '1' : '';
      const underlineCode = underline ? '4' : '';
      const codes = [boldCode, underlineCode, fgCode, bgCode].filter(Boolean).join(';');
      ansiText += `\x1b[${codes}m${selected}\x1b[0m`;
    }
    if (after) {
      ansiText += after;
    }
    ansiText += '\n```';

    return { ansiText, segments };
  };

  const generateDiscordText = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.slice(start, end);

    if (!selectedText) {
      // If no text is selected, apply to the entire text
      const { ansiText, segments } = applyFormatting(inputText, color, bgColor, false, false, 0, inputText.length);
      setOutputText(ansiText);
      setStyledSegments(segments);
    } else {
      // Apply formatting only to the selected text
      const { ansiText, segments } = applyFormatting(inputText, color, bgColor, false, false, start, end);
      setOutputText(ansiText);
      setStyledSegments(segments);
    }
  };

  const applyBold = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.slice(start, end);

    if (!selectedText) {
      // If no text is selected, apply to the entire text
      const { ansiText, segments } = applyFormatting(inputText, color, bgColor, true, false, 0, inputText.length);
      setOutputText(ansiText);
      setStyledSegments(segments);
    } else {
      // Apply bold formatting only to the selected text
      const { ansiText, segments } = applyFormatting(inputText, color, bgColor, true, false, start, end);
      setOutputText(ansiText);
      setStyledSegments(segments);
    }
  };

  const applyUnderline = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.slice(start, end);

    if (!selectedText) {
      // If no text is selected, apply to the entire text
      const { ansiText, segments } = applyFormatting(inputText, color, bgColor, false, true, 0, inputText.length);
      setOutputText(ansiText);
      setStyledSegments(segments);
    } else {
      // Apply underline formatting only to the selected text
      const { ansiText, segments } = applyFormatting(inputText, color, bgColor, false, true, start, end);
      setOutputText(ansiText);
      setStyledSegments(segments);
    }
  };

  const resetFormatting = () => {
    setInputText(''); // Clear the input text
    setColor('#ffffff'); // Reset FG to white
    setBgColor('#002b36'); // Reset BG to firefly dark blue
    setOutputText(''); // Clear the output
    setStyledSegments([]); // Clear the styled segments
    if (textareaRef.current) {
      textareaRef.current.value = ''; // Clear the textarea
    }
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
        <Button variant="outline" onClick={applyUnderline} leftSection={<IconUnderline size={16} />}>
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

      <Button onClick={generateDiscordText}>Generate</Button>

      {outputText && styledSegments.length > 0 && (
        <Stack gap="xs">
          <Box
            p="sm"
            style={{
              backgroundColor: '#2F3136', // Match the app background for a seamless look
              borderRadius: '4px',
              border: '1px solid #444',
            }}
          >
            {styledSegments.map((segment, index) => (
              <Text
                key={index}
                component="span"
                style={{
                  color: segment.fg,
                  backgroundColor: segment.bg,
                  fontWeight: segment.bold ? 'bold' : 'normal',
                  textDecoration: segment.underline ? 'underline' : 'none',
                  fontFamily: '"Whitney", "Helvetica Neue", Helvetica, Arial, sans-serif',
                }}
              >
                {segment.text}
              </Text>
            ))}
          </Box>
          <Code block>{outputText}</Code>
          <Group>
            <Button
              variant="outline"
              onClick={() => clipboard.copy(outputText)}
            >
              {clipboard.copied ? 'Copied!' : 'Copy text as Discord formatted'}
            </Button>
          </Group>
        </Stack>
      )}
    </Stack>
  );
}