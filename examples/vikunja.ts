// look at the payload at the very end to know what to pick in targets

// This is for clickable links -- nothing else
const baseUrl = 'YourVikunjaUrlWithoutEndingSlashHere';

// ---------------------------------------
// Types
// ---------------------------------------
type PayloadType = {
	event_name: string;
	data: {
		project: {
			title: string;
		};
		task: {
			assignees: null | any; // TODO not working atm
			due_date: string;
			title: string;
			description: string;
			done: boolean;
			percent_done: number;
			id: number;
		};
	};
};

// ---------------------------------------
// Helper Functions
// ---------------------------------------
const isValidDate = (dateStr: string) => {
	return dateStr && dateStr !== '0001-01-01T00:00:00Z';
};

const formatTime = (dateStr: string) => {
	const date = new Date(dateStr);

	// This creates a formatter for the "de-DE" or "en-GB" locale
	// which uses the DD.MM.YYYY structure.
	const formatter = new Intl.DateTimeFormat('de-DE', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false // Ensures 24-hour format
	});

	// .format() returns "10.03.2025, 11:34"
	// We replace the comma to match your exact request
	return formatter.format(date).replace(',', '');
};

// ---------------------------------------
// Parsing
// ---------------------------------------
const payloadData = payload.data as PayloadType;
let title = '';
let message = '';
let link = baseUrl;

// default send it
result.action = 'continue';

switch (payloadData.event_name) {
	case 'task.overdue':
		title += `🔴 Überfällig: ${payloadData.data.task.title}`;
		break;
	case 'task.reminder.fired':
		title += `🟠 Erinnerung: ${payloadData.data.task.title}`;
		break;
	default:
		// actually dont send it
		result.action = 'error';
		break;
}

// show final due date if set
if (isValidDate(payloadData.data.task.due_date)) {
	const dueDate = payloadData.data.task.due_date;
	message += `Fällig: ${formatTime(dueDate)}\n`;
}

// add description if there
if (payloadData.data.task.description.length) {
	message += `---\n${payloadData.data.task.description}`;
}

// construct link
link += `/tasks/${payloadData.data.task.id}`;

// add our results
result.title = title;
result.message = message;

// metadata for ha target
const meta = {
	image: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/webp/vikunja.webp',
	group: 'Vikunja',
	link: link
};

// used for HA Target
result.payload = meta;
