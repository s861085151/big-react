import { beginWork } from './beginWork';
import { completeWork } from './completeWork';
import { FiberNode } from './fiber';

let workInProgress: FiberNode | null = null;

function prepareRefreshStack(filber: FiberNode) {
	workInProgress = filber;
}

function renderRoot(root: FiberNode) {
	// 初始化
	prepareRefreshStack(root);

	do {
		try {
			wookLoop();
		} catch (e) {
			console.error('wookLoop发生错误', e);
			workInProgress = null;
		}
	} while (true);
}

function wookLoop() {
	while (workInProgress !== null) {
		performUnitOfWork(workInProgress);
	}
}

function performUnitOfWork(fiber: FiberNode) {
	const next = beginWork(fiber);
	fiber.memoizedProps = fiber.pendingProps;

	if (next === null) {
		completeUnitOfWork(next);
	} else {
		workInProgress = next;
	}
}

function completeUnitOfWork(fiber: FiberNode) {
	let node: FiberNode | null = fiber;

	do {
		completeWork(fiber);
		const sibling = fiber.sibling;
		if (sibling !== null) {
			workInProgress = sibling;
			return;
		}
		node = node.return;
		workInProgress = node;
	} while (node !== null);
}
