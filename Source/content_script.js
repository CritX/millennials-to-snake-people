function walk(rootNode)
{
    // Find all the text nodes in rootNode
    var walker = document.createTreeWalker(
        rootNode,
        NodeFilter.SHOW_TEXT,
        null,
        false
    ),
    node;

    // Modify each text node's value
    while (node = walker.nextNode()) {
        handleText(node);
    }
}

function handleText(textNode) {
  textNode.nodeValue = replaceText(textNode.nodeValue);
}

function replaceText(v)
{
    v = v.replace(/\b(I|i)scosceles?\b/g, "$1scoceles");
    v = v.replace(/\bEngland('s)?\b/g, "my city$1");
    v = v.replace(/\bTrump('s)?\b/g, "Drumpf$1");
    v = v.replace(/\b((I|i)t's (E|e)veryday (B|b)ro?\b/g, "England is my city");
    v = v.replace(/\bIt's Everyday Bro?\b/g, "England is my city");
    v = v.replace(/\bMinecraft?\b/g, "cringe");
    v = v.replace(/\b(G|g)randayy?\b/g, "$1od");
    
    // And now for every single rendition of CS:GO
    v = v.replace(/\bCS:GO?\b/g, "Suka Blyat");
    v = v.replace(/\bCounter-Strike: Global Offensive?\b/g, "Suka Blyat");
    
    v = v.replace(/\bTeam Fortress 2?\b/g, "CS:GO ripoff");
    v = v.replace(/\bTF2?\b/g, "CS:GO ripoff");
    v = v.replace(/\bOverwatch?\b/g, "CS:GO anime");
    
    v = v.replace(/\bShrek?\b/g, "All Stars");
    v = v.replace(/\bAll Stars?\b/g, "Shrek");
    v = v.replace(/\b(M|m)ille(nn|n)ial(s|'s)?\b/g, "faithful servants");
    v = v.replace(/\b(Jake Paul|JAKE PAUL)?\b/g, "Your mom");
    v = v.replace(/\b(Pyrocynical | PewDiePie)?\b/g, "Your dad");

    return v;
}

// Returns true if a node should *not* be altered in any way
function isForbiddenNode(node) {
    return node.isContentEditable || // DraftJS and many others
    (node.parentNode && node.parentNode.isContentEditable) || // Special case for Gmail
    (node.tagName && (node.tagName.toLowerCase() == "textarea" || // Some catch-alls
                     node.tagName.toLowerCase() == "input"));
}

// The callback used for the document body and title observers
function observerCallback(mutations) {
    var i, node;

    mutations.forEach(function(mutation) {
        for (i = 0; i < mutation.addedNodes.length; i++) {
            node = mutation.addedNodes[i];
            if (isForbiddenNode(node)) {
                // Should never operate on user-editable content
                continue;
            } else if (node.nodeType === 3) {
                // Replace the text for text nodes
                handleText(node);
            } else {
                // Otherwise, find text nodes within the given node and replace text
                walk(node);
            }
        }
    });
}

// Walk the doc (document) body, replace the title, and observe the body and title
function walkAndObserve(doc) {
    var docTitle = doc.getElementsByTagName('title')[0],
    observerConfig = {
        characterData: true,
        childList: true,
        subtree: true
    },
    bodyObserver, titleObserver;

    // Do the initial text replacements in the document body and title
    walk(doc.body);
    doc.title = replaceText(doc.title);

    // Observe the body so that we replace text in any added/modified nodes
    bodyObserver = new MutationObserver(observerCallback);
    bodyObserver.observe(doc.body, observerConfig);

    // Observe the title so we can handle any modifications there
    if (docTitle) {
        titleObserver = new MutationObserver(observerCallback);
        titleObserver.observe(docTitle, observerConfig);
    }
}
walkAndObserve(document);
