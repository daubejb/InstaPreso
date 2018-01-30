/***********************************************************************
MIT License

Copyright (c) 2018 daubedesign

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
************************************************************************/

//============================================================================GLOBAL STUFF

var doc = DocumentApp.getActiveDocument()
var body = doc.getBody()
var ui = DocumentApp.getUi()

//============================================================================SETUP STUFF

function onOpen(e) {
  DocumentApp.getUi().createAddonMenu()
      .addItem('Start', 'showSidebar')
      .addToUi()
      showSidebar()
}

function showSidebar() {
  var sidebar = HtmlService.createTemplateFromFile('Page').evaluate()
       .setSandboxMode(HtmlService.SandboxMode.IFRAME)
       .setTitle('InstaPreso')
       .setWidth(300)
  DocumentApp.getUi().showSidebar(sidebar)
}

function onInstall(e) {
  onOpen(e)
}

//============================================================================MAIN FUNCTIONS

//================================================================CREATE PRESO

function createPreso() {
  var text = body.getText()
  Logger.log(text)
  Logger.log(text.length)

  
  var dividerPositions = getDividerPositions(text)
  
  var slides = getSlideContent(text, dividerPositions)
  
  for (var i = 0; i < slides.length; i++) {
    var type = slides[i].substring(0, 7)
    if (type === 'Title: ') {
      createTitleSlide(slides[i])
    }
  }
}
//================================================================GET DIVIDER POSITIONS
function getDividerPositions(t) {
  var dividerCount = (t.match(/---/g).length)
  var dividerPositions = []
  for (var i = 0; i < dividerCount; i++) {
    if (i === 0) {
      dividerPositions[i] = t.indexOf('---')
    } else {
      dividerPositions[i] = t.indexOf('---', dividerPositions[i - 1] + 3)
    }
  }
  return dividerPositions
}
//================================================================GET SLIDE CONTENT
function getSlideContent(t, dP) {
var slides = []
var slideCount = (t.match(/---/g).length)
  for (var j = 0; j < slideCount; j++) {
    if (j === 0) {
      slides[j] = t.slice(0, dP[j])
    } else {
      slides[j] = t.slice(dP[j - 1] + 3, dP[j])
    }
  }
  return slides
}
//================================================================CREATE TITLE SLIDE

function createTitleSlide(text) {
  Logger.log(text)
  var elements = text.split('\n')
  Logger.log(elements)
  for (var i = 0; i < elements.length; i++ ) {
    var el = elements[i]
    Logger.log(el)
    var elType = el.slice(0, 7)
    switch (elType) {
      case 'Title: ': var title = el.slice(7); break
      case 'Subtitl': var subtitle = el.slice(10); break
    }
  }
  
  var preso = createAndFormatDefaultPreso(title)  

  var titleSlide = preso.insertSlide(0, SlidesApp.PredefinedLayout.TITLE)
  var titleSlideElements = titleSlide.getPageElements()
  var titleElement = titleSlideElements[0].asShape().getText().setText(title)
  var subtitleElement = titleSlideElements[1].asShape().getText().setText(subtitle)
}
//================================================================CREATE AND FORMAT DEFAULT PRESO
function createAndFormatDefaultPreso(title) {
  var preso = SlidesApp.create(title)
  var defaultTitleSlide = preso.getSlides()[0]
  defaultTitleSlide.remove()
  return preso
}
//================================================================CREATE LAYOUT

function createLayout() {
  var eAT = body.editAsText()
  var title = eAT.appendText('Title: <Enter the presentation title here>\n')
  var subtitle = eAT.appendText('Subtitle: <Subtitle goes here>\n')
  var slideDivider = eAT.appendText('\n---\n\n')
}

//============================================================================HELPER FUNCTIONS

function displayAlert(m) {
  ui.alert("An error occured:" + m, ui.ButtonSet.OK)
}