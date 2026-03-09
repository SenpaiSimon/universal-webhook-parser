// look at the payload at the very end to know what to pick in targets

// This is for clickable links -- nothing else
const baseUrl = 'YourKomodoUrlWithoutEndingSlashHere';

// --------------------------------------
// types from https://github.com/moghtech/komodo/blob/34a9f8eb9ef305103b678c1b46782700313f637f/client/core/ts/src/types.ts#L1391
// --------------------------------------
interface MongoIdObj {
	$oid: string;
}

type I64 = number;

type MongoId = MongoIdObj;

type ResourceTarget =
	| { type: 'System'; id: string }
	| { type: 'Server'; id: string }
	| { type: 'Stack'; id: string }
	| { type: 'Deployment'; id: string }
	| { type: 'Build'; id: string }
	| { type: 'Repo'; id: string }
	| { type: 'Procedure'; id: string }
	| { type: 'Action'; id: string }
	| { type: 'Builder'; id: string }
	| { type: 'Alerter'; id: string }
	| { type: 'ResourceSync'; id: string };

interface __Serror {
	error: string;
	trace: string[];
}

type _Serror = __Serror;

interface Version {
	major: number;
	minor: number;
	patch: number;
}

enum StackState {
	/** The stack is currently re/deploying */
	Deploying = 'deploying',
	/** All containers are running. */
	Running = 'running',
	/** All containers are paused */
	Paused = 'paused',
	/** All contianers are stopped */
	Stopped = 'stopped',
	/** All containers are created */
	Created = 'created',
	/** All containers are restarting */
	Restarting = 'restarting',
	/** All containers are dead */
	Dead = 'dead',
	/** All containers are removing */
	Removing = 'removing',
	/** The containers are in a mix of states */
	Unhealthy = 'unhealthy',
	/** The stack is not deployed */
	Down = 'down',
	/** Server not reachable for status */
	Unknown = 'unknown'
}

enum DeploymentState {
	/** The deployment is currently re/deploying */
	Deploying = 'deploying',
	/** Container is running */
	Running = 'running',
	/** Container is created but not running */
	Created = 'created',
	/** Container is in restart loop */
	Restarting = 'restarting',
	/** Container is being removed */
	Removing = 'removing',
	/** Container is paused */
	Paused = 'paused',
	/** Container is exited */
	Exited = 'exited',
	/** Container is dead */
	Dead = 'dead',
	/** The deployment is not deployed (no matching container) */
	NotDeployed = 'not_deployed',
	/** Server not reachable for status */
	Unknown = 'unknown'
}

enum SeverityLevel {
	/**
	 * No problem.
	 *
	 * Aliases: ok, low, l
	 */
	Ok = 'OK',
	/**
	 * Problem is imminent.
	 *
	 * Aliases: warning, w, medium, m
	 */
	Warning = 'WARNING',
	/**
	 * Problem fully realized.
	 *
	 * Aliases: critical, c, high, h
	 */
	Critical = 'CRITICAL'
}

type AlertData =
	/** A null alert */
	| { type: 'None'; data: {} }
	/**
	 * The user triggered a test of the
	 * Alerter configuration.
	 */
	| {
			type: 'Test';
			data: {
				/** The id of the alerter */
				id: string;
				/** The name of the alerter */
				name: string;
			};
	  }
	/** A server could not be reached. */
	| {
			type: 'ServerUnreachable';
			data: {
				/** The id of the server */
				id: string;
				/** The name of the server */
				name: string;
				/** The region of the server */
				region?: string;
				/** The error data */
				err?: _Serror;
			};
	  }
	/** A server has high CPU usage. */
	| {
			type: 'ServerCpu';
			data: {
				/** The id of the server */
				id: string;
				/** The name of the server */
				name: string;
				/** The region of the server */
				region?: string;
				/** The cpu usage percentage */
				percentage: number;
			};
	  }
	/** A server has high memory usage. */
	| {
			type: 'ServerMem';
			data: {
				/** The id of the server */
				id: string;
				/** The name of the server */
				name: string;
				/** The region of the server */
				region?: string;
				/** The used memory */
				used_gb: number;
				/** The total memory */
				total_gb: number;
			};
	  }
	/** A server has high disk usage. */
	| {
			type: 'ServerDisk';
			data: {
				/** The id of the server */
				id: string;
				/** The name of the server */
				name: string;
				/** The region of the server */
				region?: string;
				/** The mount path of the disk */
				path: string;
				/** The used portion of the disk in GB */
				used_gb: number;
				/** The total size of the disk in GB */
				total_gb: number;
			};
	  }
	/** A server has a version mismatch with the core. */
	| {
			type: 'ServerVersionMismatch';
			data: {
				/** The id of the server */
				id: string;
				/** The name of the server */
				name: string;
				/** The region of the server */
				region?: string;
				/** The actual server version */
				server_version: string;
				/** The core version */
				core_version: string;
			};
	  }
	/** A container's state has changed unexpectedly. */
	| {
			type: 'ContainerStateChange';
			data: {
				/** The id of the deployment */
				id: string;
				/** The name of the deployment */
				name: string;
				/** The server id of server that the deployment is on */
				server_id: string;
				/** The server name */
				server_name: string;
				/** The previous container state */
				from: DeploymentState;
				/** The current container state */
				to: DeploymentState;
			};
	  }
	/** A Deployment has an image update available */
	| {
			type: 'DeploymentImageUpdateAvailable';
			data: {
				/** The id of the deployment */
				id: string;
				/** The name of the deployment */
				name: string;
				/** The server id of server that the deployment is on */
				server_id: string;
				/** The server name */
				server_name: string;
				/** The image with update */
				image: string;
			};
	  }
	/** A Deployment has an image update available */
	| {
			type: 'DeploymentAutoUpdated';
			data: {
				/** The id of the deployment */
				id: string;
				/** The name of the deployment */
				name: string;
				/** The server id of server that the deployment is on */
				server_id: string;
				/** The server name */
				server_name: string;
				/** The updated image */
				image: string;
			};
	  }
	/** A stack's state has changed unexpectedly. */
	| {
			type: 'StackStateChange';
			data: {
				/** The id of the stack */
				id: string;
				/** The name of the stack */
				name: string;
				/** The server id of server that the stack is on */
				server_id: string;
				/** The server name */
				server_name: string;
				/** The previous stack state */
				from: StackState;
				/** The current stack state */
				to: StackState;
			};
	  }
	/** A Stack has an image update available */
	| {
			type: 'StackImageUpdateAvailable';
			data: {
				/** The id of the stack */
				id: string;
				/** The name of the stack */
				name: string;
				/** The server id of server that the stack is on */
				server_id: string;
				/** The server name */
				server_name: string;
				/** The service name to update */
				service: string;
				/** The image with update */
				image: string;
			};
	  }
	/** A Stack was auto updated */
	| {
			type: 'StackAutoUpdated';
			data: {
				/** The id of the stack */
				id: string;
				/** The name of the stack */
				name: string;
				/** The server id of server that the stack is on */
				server_id: string;
				/** The server name */
				server_name: string;
				/** One or more images that were updated */
				images: string[];
			};
	  }
	/** An AWS builder failed to terminate. */
	| {
			type: 'AwsBuilderTerminationFailed';
			data: {
				/** The id of the aws instance which failed to terminate */
				instance_id: string;
				/** A reason for the failure */
				message: string;
			};
	  }
	/** A resource sync has pending updates */
	| {
			type: 'ResourceSyncPendingUpdates';
			data: {
				/** The id of the resource sync */
				id: string;
				/** The name of the resource sync */
				name: string;
			};
	  }
	/** A build has failed */
	| {
			type: 'BuildFailed';
			data: {
				/** The id of the build */
				id: string;
				/** The name of the build */
				name: string;
				/** The version that failed to build */
				version: Version;
			};
	  }
	/** A repo has failed */
	| {
			type: 'RepoBuildFailed';
			data: {
				/** The id of the repo */
				id: string;
				/** The name of the repo */
				name: string;
			};
	  }
	/** A procedure has failed */
	| {
			type: 'ProcedureFailed';
			data: {
				/** The id of the procedure */
				id: string;
				/** The name of the procedure */
				name: string;
			};
	  }
	/** An action has failed */
	| {
			type: 'ActionFailed';
			data: {
				/** The id of the action */
				id: string;
				/** The name of the action */
				name: string;
			};
	  }
	/** A schedule was run */
	| {
			type: 'ScheduleRun';
			data: {
				/** Procedure or Action */
				resource_type: ResourceTarget['type'];
				/** The resource id */
				id: string;
				/** The resource name */
				name: string;
			};
	  }
	/**
	 * Custom header / body.
	 * Produced using `/execute/SendAlert`
	 */
	| {
			type: 'Custom';
			data: {
				/** The alert message. */
				message: string;
				/** Message details. May be empty string. */
				details?: string;
			};
	  };

interface Alert {
	/**
	 * The Mongo ID of the alert.
	 * This field is de/serialized from/to JSON as
	 * `{ "_id": { "$oid": "..." }, ...(rest of serialized Alert) }`
	 */
	_id?: MongoId;
	/** Unix timestamp in milliseconds the alert was opened */
	ts: I64;
	/** Whether the alert is already resolved */
	resolved: boolean;
	/** The severity of the alert */
	level: SeverityLevel;
	/** The target of the alert */
	target: ResourceTarget;
	/** The data attached to the alert */
	data: AlertData;
	/** The timestamp of alert resolution */
	resolved_ts?: I64;
}

// --------------------------------------
// helpers
// --------------------------------------

// convert to nice color indicators
function LevelToColor(level: SeverityLevel): string {
	switch (level) {
		case SeverityLevel.Ok:
			return '🟢';
		case SeverityLevel.Critical:
			return '🔴';
		case SeverityLevel.Warning:
			return '🟠';
		default:
			return '🔵';
	}
}

// mark as skip if severity is ok
function SkipOk(level: SeverityLevel) {
	if (level === SeverityLevel.Ok) {
		result.action = 'skip';
	} else {
		result.action = 'continue';
	}
}

// --------------------------------------
// actual parsing
// --------------------------------------
const payloadData = payload.data as Alert;
const level = payloadData.level;
const levelColor = LevelToColor(level);

const groupBase = 'Komodo';

let title = '';
let message = '';
let link = baseUrl;
let group = groupBase;

switch (payloadData.data.type) {
	case 'ScheduleRun': {
		const data = payloadData.data.data;
		title += `${levelColor} Schedule ${data.name} ran`;
		message += `Ressource: ${data.resource_type}`;
		link += `/procedures/${data.id}`;
		group += ' Procedures';
		SkipOk(level);
		break;
	}

	case 'ActionFailed': {
		const data = payloadData.data.data;
		title += `🔴 Action ${data.name} failed`;
		link += `/actions/${data.id}`;
		group += ' Procedures';
		result.action = 'continue';
		break;
	}

	case 'ProcedureFailed': {
		const data = payloadData.data.data;
		title += `🔴 Procedure ${data.name} failed`;
		link += `/procedures/${data.id}`;
		group += ' Procedures';
		result.action = 'continue';
		break;
	}

	case 'RepoBuildFailed': {
		const data = payloadData.data.data;
		title += `🔴 Repo ${data.name} build failed`;
		link += `/repos/${data.id}`;
		group += ' Builds';
		result.action = 'continue';
		break;
	}

	case 'BuildFailed': {
		const data = payloadData.data.data;
		title += `🔴 Build ${data.name} failed`;
		message += `Failed Version: ${data.version}`;
		link += `/builds/${data.id}`;
		group += ' Builds';
		result.action = 'continue';
		break;
	}

	case 'StackAutoUpdated': {
		const data = payloadData.data.data;
		title += `${levelColor} Stack ${data.name} on ${data.server_name} updated`;
		for (const image of data.images) {
			message += `- ${image}\n`;
		}
		link += `/stacks/${data.id}`;
		group += ' Stacks';
		result.action = 'continue';
		break;
	}

	case 'StackImageUpdateAvailable': {
		const data = payloadData.data.data;
		title += `🔵 Stack ${data.name} on ${data.server_name} has updates`;
		message += `- ${data.image}\n`;
		link += `/stacks/${data.id}`;
		group += ' Stacks';
		result.action = 'continue';
		break;
	}

	case 'StackStateChange': {
		const data = payloadData.data.data;

		title += `${levelColor} Stack ${data.name} on ${data.server_name} changed`;
		message += `From: ${data.from}\n`;
		message += `To  : ${data.to}`;
		link += `/stacks/${data.id}`;
		group += ' Stacks';

		switch (data.to) {
			case StackState.Dead:
			case StackState.Down:
			case StackState.Stopped:
			case StackState.Unhealthy:
			case StackState.Unknown:
			case StackState.Paused: {
				result.action = 'continue';
				break;
			}
			default: {
				result.action = 'skip';
				break;
			}
		}
		break;
	}

	case 'DeploymentAutoUpdated': {
		const data = payloadData.data.data;
		title += `${levelColor} Deployment ${data.name} on ${data.server_name} updated`;
		message += `- ${data.image}\n`;
		link += `/deployments/${data.id}`;
		group += ' Deployments';
		result.action = 'continue';
		break;
	}

	case 'DeploymentImageUpdateAvailable': {
		const data = payloadData.data.data;
		title += `🔵 Deployment ${data.name} on ${data.server_name} has updates`;
		message += `- ${data.image}\n`;
		link += `/deployments/${data.id}`;
		group += ' Deployments';
		result.action = 'continue';
		break;
	}

	case 'ContainerStateChange': {
		const data = payloadData.data.data;

		title += `${levelColor} Deployment ${data.name} on ${data.server_name} changed`;
		message += `From: ${data.from}\n`;
		message += `To  : ${data.to}`;
		link += `/deployments/${data.id}`;
		group += ' Deployments';

		switch (data.to) {
			case DeploymentState.Dead:
			case DeploymentState.Exited:
			case DeploymentState.NotDeployed:
			case DeploymentState.Unknown: {
				result.action = 'continue';
				break;
			}
			default: {
				result.action = 'skip';
				break;
			}
		}
		break;
	}

	case 'ServerVersionMismatch': {
		const data = payloadData.data.data;
		title += `🔴 Server ${data.name} version missmatch`;
		message += `Core Version: ${data.core_version}\n`;
		message += `Server Version: ${data.server_version}`;
		link += `/servers/${data.id}`;
		group += ' Servers';
		result.action = 'continue';
		break;
	}

	case 'ServerDisk': {
		const data = payloadData.data.data;
		title += `🟠 Server ${data.name} high disk usage`;
		message += `Used ${data.used_gb}/${data.total_gb} GB`;
		link += `/servers/${data.id}`;
		group += ' Servers';
		SkipOk(level);
		break;
	}

	case 'ServerMem': {
		const data = payloadData.data.data;
		title += `🟠 Server ${data.name} high ram usage`;
		message += `Used ${data.used_gb}/${data.total_gb} GB`;
		link += `/servers/${data.id}`;
		group += ' Servers';
		SkipOk(level);
		break;
	}

	case 'ServerCpu': {
		const data = payloadData.data.data;
		title += `🟠 Server ${data.name} high CPU usage`;
		message += `Using ${data.percentage.toFixed(2)}%`;
		link += `/servers/${data.id}`;
		group += ' Servers';
		SkipOk(level);
		break;
	}

	case 'ServerUnreachable': {
		const data = payloadData.data.data;
		title += `🔴 Server ${data.name} is unreachable`;
		message += `Error: ${data.err}`;
		link += `/servers/${data.id}`;
		group += ' Servers';
		result.action = 'continue';
		break;
	}

	case 'AwsBuilderTerminationFailed': {
		const data = payloadData.data.data;
		title += `🔴 AWS Builder Term Failed`;
		message += `Msg: ${data.message}\n`;
		message += `ID: ${data.instance_id}`;
		group += ' Builds';
		result.action = 'continue';
		break;
	}

	case 'ResourceSyncPendingUpdates': {
		const data = payloadData.data.data;
		title += `${levelColor} Ressource ${data.name} has updates`;
		link += `/resource-syncs/${data.id}`;
		group += ' Syncs';
		result.action = 'continue';
		break;
	}

	case 'Custom': {
		const data = payloadData.data.data;
		title += `${levelColor} ${data.message}`;
		message += `${data.details}`;
		break;
	}

	case 'Test': {
		const data = payloadData.data.data;
		title += `🟢 Hello from ${data.name}`;
		message += `Seems like its working :)`;
		link += `/alerters/${data.id}`;
		result.action = 'continue';
		break;
	}

	case 'None': {
		title += `🔵 Received "none" type alert`;
		result.action = 'continue';
		break;
	}
}

// append out infos
result.title = title;
result.message = message;

// metadata for our target
const metadata = {
	image: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/webp/komodo.webp',
	group,
	link
};

// used for HA target!
result.payload = metadata;
