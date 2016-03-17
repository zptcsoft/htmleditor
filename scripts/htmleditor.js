var runner = document.getElementById('runner'),
    editor = document.getElementById('editor'),
    downloader = document.getElementById('downloader'),
    fileChooser = document.getElementById('fileChooser'),
    resizer = document.getElementById('resizer'),
    viewsToggler = document.getElementById('viewsToggler'),
    themesToggler = document.getElementById('themesToggler');

var preview = function() {

    if (runner.checked) {
        var viewer = document.getElementById('viewer');
        try {
            var viewerDoc = viewer.contentDocument;
            viewerDoc.open();
            viewerDoc.write(editor.value);
            viewerDoc.close();
        } catch(e) { // in case of iframe redirection to a different origin
            viewer.src = 'about:blank';
            setTimeout(preview, 4); // minimum delay
        }
    }

};

editor.addEventListener('input', preview);
runner.addEventListener('change', preview);

var createURL = function() {
    var blob = new Blob([editor.value], {
        type: 'text/html'
    });

    downloader.href = window.URL.createObjectURL(blob);
}

editor.addEventListener('change', createURL);

var previewAndCreateURL = function() {
    preview();
    createURL();
}

document.getElementById('resetter').addEventListener('click', function() {

        if (! editor.value
           || editor.value != editor.defaultValue
           && confirm("Los cambios que has echo se perderán. ¿estas seguro(a) de limpiar todo?")) {
            downloader.download = 'plantilla.html';
            fileChooser.value = '';
            editor.value = editor.defaultValue;
            previewAndCreateURL();
        } else if (editor.value == editor.defaultValue) {
            downloader.download = 'plantilla.html';
            fileChooser.value = '';
        }
});

document.getElementById('selector').addEventListener('click', function() {
    editor.select();
});

fileChooser.addEventListener('change', function() {
    var file = this.files[0],
        reader = new FileReader();

    // to ensure that there's a file to read so Chrome and Opera
    // don't run this function when you cancel choosing a new file
    if (file) {
        downloader.download = file.name;
        reader.readAsText(file);
        reader.addEventListener('load', function() {
            editor.value = this.result;
            previewAndCreateURL();
        });
    }

});

var resize = function() {
    var resizerVal = resizer.value;
    document.getElementById('editorWrapper').style.flexGrow = resizerVal;
    document.getElementById('viewerWrapper').style.flexGrow = 100 - resizerVal;
    document.getElementById('indicator').textContent = (resizerVal / 100).toFixed(2); // Edge doesn't support outputObject.value
};

resizer.addEventListener('input', resize);

var toggleViews = function() {
    var main = document.getElementById('main');
    if (viewsToggler.checked) {
        main.classList.add('main--horizontal');
    } else {
        main.classList.remove('main--horizontal');
    }
};

viewsToggler.addEventListener('change', toggleViews);

var toggleThemes = function() {
    if (themesToggler.checked) {
        editor.classList.add('textarea--dark');
    } else {
        editor.classList.remove('textarea--dark');
    }
};

themesToggler.addEventListener('change', toggleThemes);

document.getElementById('more').addEventListener('click', function() {

    if (this.title == 'Más') {
        this.title = 'Menos';
    } else {
        this.title = 'Más';
    }

    this.classList.toggle('on');
    document.getElementById('footer').classList.toggle('footer--shown');
});

window.addEventListener('beforeunload', function(event) {

    if (editor.value && editor.value != editor.defaultValue) {
        event.returnValue = 'Los cambios se pueden perder.';
    }
});

resize();
toggleViews();
toggleThemes();
previewAndCreateURL();
