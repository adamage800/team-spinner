# Daily spinner 3000

A fun, colorful CLI spinner for team leads who are tired of selecting daily standup members in a predictable order. This interactive spinner randomly selects team members and predicts their mood with playful personality traits!

## Features

- Animated name selection with colorful ASCII art
- Random personality mood predictions (cool, smart, sporty, musical, ninja, and 50+ more!)
- Interactive keyboard controls
- Customizable team member lists
- Fun emoji displays

## Installation

```bash
npm install
```

## Usage

### Basic usage

Start the spinner with the names configured in `config.json`:

```bash
npm start
```

or

```bash
node index.js
```

### Controls

- **SPACE** or **ENTER**: Spin and select the next team member
- **Q**: Quit the application

### Configuration

Update the `config.json` file to include your team members:

```json
{
  "names": ["Alice", "Bob", "Charlie", "Diana", "Evan"]
}
```

### Command line options

#### Use a custom list (without modifying config.json)

Provide a JSON array of names directly:

```bash
node index.js -l '["Alice", "Bob", "Charlie"]'
```

#### Add extra people temporarily

Add one or more names to the configured list:

```bash
node index.js -a Alice -a Bob
```

#### Remove people

Remove one or more names from the configured list:

```bash
node index.js -r Charlie -r Diana
```

#### Combine options

You can combine multiple options:

```bash
node index.js -a NewMember -r VacationMember
```

## How it works

1. The spinner randomly selects a team member from your list
2. When selected, the spinner displays their name in fun ASCII art surrounded by personality-themed emojis
3. The selected person is removed from the list for the session
4. Repeat until everyone has been selected!

## License

MIT
