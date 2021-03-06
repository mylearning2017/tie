// Copyright 2017 The TIE Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Unit tests for the FeedbackGeneratorService.
 */

describe('FeedbackGeneratorService', function() {
  var CodeEvalResultObjectFactory;
  var FeedbackGeneratorService;

  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    CodeEvalResultObjectFactory = $injector.get('CodeEvalResultObjectFactory');
    FeedbackGeneratorService = $injector.get('FeedbackGeneratorService');
  }));

  describe('_jsToHumanReadable', function() {
    it('should return "stringified" (readable) versions of input variables',
      function() {
      expect(
        FeedbackGeneratorService._jsToHumanReadable(null)
      ).toEqual('None');
      expect(
        FeedbackGeneratorService._jsToHumanReadable(undefined)
      ).toEqual('None');
      expect(
        FeedbackGeneratorService._jsToHumanReadable('cat')
      ).toEqual('"cat"');
      expect(
        FeedbackGeneratorService._jsToHumanReadable(1)
      ).toEqual('1');
      expect(
        FeedbackGeneratorService._jsToHumanReadable(true)
      ).toEqual('True');
      expect(
        FeedbackGeneratorService._jsToHumanReadable(false)
      ).toEqual('False');
      expect(
        FeedbackGeneratorService._jsToHumanReadable([1, 3, 5])
      ).toEqual('[1, 3, 5]');
      expect(
        FeedbackGeneratorService._jsToHumanReadable({a: 3, b: 5, c: 'j'})
      ).toEqual('{"a": 3, "b": 5, "c": "j"}');
    });
  });

  describe('getFeedback', function() {
    it('should return an error if one exists', function() {
      var questionMock = {};
      var codeEvalResult = CodeEvalResultObjectFactory.create(
        'some code', 'some output', [], [], [], 'ERROR MESSAGE', 'testInput');

      var paragraphs = FeedbackGeneratorService.getFeedback(
        questionMock, codeEvalResult).getParagraphs();

      expect(paragraphs.length).toEqual(2);
      expect(paragraphs[0].isTextParagraph()).toBe(true);
      expect(paragraphs[0].getContent()).toBe([
        'Looks like your code had a runtime error when evaluating the input ' +
        '"testInput". Here\'s the trace:'
      ].join(''));
      expect(paragraphs[1].isCodeParagraph()).toBe(true);
      expect(paragraphs[1].getContent()).toBe('ERROR MESSAGE');
    });

    it('should return a specific error for TimeLimitErrors', function() {
      var questionMock = {};
      var codeEvalResult = CodeEvalResultObjectFactory.create(
        'some code', 'some output', [], [], [], 'TimeLimitError', 
        'testInput');

      var paragraphs = FeedbackGeneratorService.getFeedback(
        questionMock, codeEvalResult).getParagraphs();

      expect(paragraphs.length).toEqual(1);
      expect(paragraphs[0].isTextParagraph()).toBe(true);
      expect(paragraphs[0].getContent()).toBe(
        ["Your program's exceeded the time limit (",
        "3 seconds) we've set. Can you try to make it run ",
        "more efficiently?"].join(''));
    });
  });
});
