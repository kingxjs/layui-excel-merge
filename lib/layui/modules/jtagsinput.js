/**
  扩展一个test组件
**/      

(function(global, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], function($) {
          return factory($, global, global.document, global.Math);
        });
    } else if (typeof exports === "object" && exports) {
        module.exports = factory(require('jquery'), global, global.document, global.Math);
    } else if (window.layui && layui.define) {
      layui.define('jquery', function (exports) { //layui加载
        exports('jtagsinput', factory(layui.jquery, global, global.document, global.Math));
      }).addcss("modules/jtagsinput/jtagsinput.min.css","skintagsinputcss");
      //});
    } else {
        factory(jQuery, global, global.document, global.Math);
    }
})(typeof window !== 'undefined' ? window : this, function(jQuery, window, document, Math, undefined) {

  // Edit by litao 2016-12-12 support jQuery 1.7+
 (function($) {
  var kaiOptions=new Array();
  var delimiter = new Array();
  var tags_callbacks = new Array();
  $.fn.doAutosize = function(o){
      var minWidth = $(this).data('minwidth'),
          maxWidth = $(this).data('maxwidth'),
          val = '',
          input = $(this),
          testSubject = $('#'+$(this).data('tester_id'));

      if (val === (val = input.val())) {return;}

      // Enter new content into testSubject
      var escaped = val.replace(/&/g, '&amp;').replace(/\s/g,' ').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      testSubject.html(escaped);
      // Calculate new width + whether to change
      var testerWidth = testSubject.width(),
          newWidth = (testerWidth + o.comfortZone) >= minWidth ? testerWidth + o.comfortZone : minWidth,
          currentWidth = input.width(),
          isValidWidthChange = (newWidth < currentWidth && newWidth >= minWidth)
                               || (newWidth > minWidth && newWidth < maxWidth);

      // Animate width
      if (isValidWidthChange) {
          input.width(newWidth);
      }


  };
  $.fn.resetAutosize = function(options){
    // alert(JSON.stringify(options));
    var minWidth =  $(this).data('minwidth') || options.minInputWidth || $(this).width(),
        maxWidth = $(this).data('maxwidth') || options.maxInputWidth || ($(this).closest('.tagsinput').width() - options.inputPadding),
        val = '',
        input = $(this),
        testSubject = $('<tester/>').css({
            position: 'absolute',
            top: -9999,
            left: -9999,
            width: 'auto',
            fontSize: input.css('fontSize'),
            fontFamily: input.css('fontFamily'),
            fontWeight: input.css('fontWeight'),
            letterSpacing: input.css('letterSpacing'),
            whiteSpace: 'nowrap'
        }),
        testerId = $(this).attr('id')+'_autosize_tester';
    if(! $('#'+testerId).length > 0){
      testSubject.attr('id', testerId);
      testSubject.appendTo('body');
    }

    input.data('minwidth', minWidth);
    input.data('maxwidth', maxWidth);
    input.data('tester_id', testerId);
    input.css('width', minWidth);
  };

  $.fn.getTags = function() {
      var id = $(this).attr('id');
      var tagslist = $(this).val().split(delimiter[id]);
      return tagslist;
  };

  $.fn.addTag = function(value,options) {
      options = $.extend({focus:false,callback:true,unique:true,removeText:'remove a Tag'},options);
      this.each(function() {
        var id = $(this).attr('id');

        var tagslist = $(this).val().split(delimiter[id]);
        if (tagslist[0] == '') {
          tagslist = new Array();
        }

        value = $.trim(value);

        var maxCount=kaiOptions[id]['maxCount'];
        if(maxCount>0 && tagslist.length>maxCount-1){
            $('#' + id + '_tag').addClass('not_valid');
            $('#' + id + '_tag').attr("title", "只能添加" + maxCount+"个");
            return;
        }
        
        var lowerCase=kaiOptions[id]['lowerCase'];
        var upperCase=kaiOptions[id]['upperCase'];
        
        if(lowerCase && upperCase){
            value = $.trim(value);
        }
        else{
            if(lowerCase){
                value = $.trim(value.toLowerCase());
            }
            if(upperCase){
                value = $.trim(value.toUpperCase());
            }
        }
        
        var _reg=kaiOptions[id]['regex'];
        if($.trim(_reg).length>0){
            if(!_reg.exec(value)){
                $('#'+id+'_tag').addClass('not_valid');
                return;
            }
        }

        if (options.unique) {
          var skipTag = $(this).tagExist(value);
          if(skipTag == true) {
              //Marks fake input as not_valid to let styling it
                $('#'+id+'_tag').addClass('not_valid');
            }
        } else {
          var skipTag = false;
        }

        if (value !='' && skipTag != true) {
                    $('<span>').addClass('tag').append(
                        $('<span>').text(value).append('&nbsp;'),
                        $('<a>', {
                            href  : '#',
                            title : options.removeText,
                            text  : 'x'
                        }).click(function () {
                            return $('#' + id).removeTag(escape(value));
                        })
                    ).insertBefore('#' + id + '_addTag');

          tagslist.push(value);

          $('#'+id+'_tag').val('');
          if (options.focus) {
            $('#'+id+'_tag').focus();
          } else {
            $('#'+id+'_tag').blur();
          }

          $.fn.tagsInput.updateTagsField(this,tagslist);

          if (options.callback && tags_callbacks[id] && tags_callbacks[id]['onAddTag']) {
            var f = tags_callbacks[id]['onAddTag'];
            f.call(this, value);
          }
          if(tags_callbacks[id] && tags_callbacks[id]['onChange'])
          {
            var i = tagslist.length;
            var f = tags_callbacks[id]['onChange'];
            f.call(this, $(this), tagslist[i-1]);
          }
        }

      });

      return false;
    };

  $.fn.removeTag = function(value) {
      value = unescape(value);
      this.each(function() {
        var id = $(this).attr('id');
        if($(this).val()!=""){
          var old = $(this).val().split(delimiter[id]);

          $('#'+id+'_tagsinput .tag').remove();
          str = '';
          $.each(old,function(index,oldval){
            if (oldval!=value) str = str + delimiter[id] +oldval;
          });
          // for (i=0; i< old.length; i++) {
          //   if (old[i]!=value) {
          //     str = str + delimiter[id] +old[i];
          //   }
          // }

          $.fn.tagsInput.importTags(this,str);

          if (tags_callbacks[id] && tags_callbacks[id]['onRemoveTag']) {
            var f = tags_callbacks[id]['onRemoveTag'];
            f.call(this, value);
          }
        }
      });

      return false;
    };

  $.fn.tagExist = function(val) {
    var id = $(this).attr('id');
    if(val=="")return false;
    var tagslist = $(this).val().split(delimiter[id]);
    return ($.inArray(val, tagslist) >= 0); //true when tag exists, false when not
  };

   // clear all existing tags and import new ones from a string
   $.fn.importTags = function(str) {
      var id = $(this).attr('id');
      $('#'+id+'_tagsinput .tag').remove();
      $.fn.tagsInput.importTags(this,str);
   }

  $.fn.tagsInput = function(options) {
    var settings = $.extend({
      interactive:true,
      defaultText:'添加关键字',
      removeText:'删除关键字',
      minChars:0,
      width:'300px',
      height: '100px',
      class:"layui-input",
      autocomplete: {selectFirst: false },
      hide:true,
      delimiter: ',',
      unique:true,
      removeWithBackspace:true,
      placeholderColor:'#666666',
      autosize: true,
      comfortZone: 20,
      inputPadding: 6*2,
      maxCount:0,
      lowerCase:false,
      upperCase:false,
      regex:''      
    },options);

      var uniqueIdCounter = 0;

    this.each(function() {
         // If we have already initialized the field, do not do it again
         if (typeof $(this).attr('data-tagsinput-init') !== 'undefined') {
            return;
         }

         // Mark the field as having been initialized
         $(this).attr('data-tagsinput-init', true);

      if (settings.hide) {
        $(this).hide();
      }
      var id = $(this).attr('id');
      if (!id || delimiter[$(this).attr('id')]) {
        id = $(this).attr('id', 'tags' + new Date().getTime() + (uniqueIdCounter++)).attr('id');
      }
       
      var data = $.extend({
        pid:id,
        real_input: '#'+id,
        holder: '#'+id+'_tagsinput',
        input_wrapper: '#'+id+'_addTag',
        fake_input: '#'+id+'_tag'
      },settings);

      kaiOptions[id]=new Array();
      kaiOptions[id]['maxCount']=settings.maxCount;
      kaiOptions[id]['lowerCase']=settings.lowerCase;
      kaiOptions[id]['upperCase']=settings.upperCase;
      kaiOptions[id]['regex']=settings.regex;
      delimiter[id] = data.delimiter;

      if (settings.onAddTag || settings.onRemoveTag || settings.onChange) {
        tags_callbacks[id] = new Array();
        tags_callbacks[id]['onAddTag'] = settings.onAddTag;
        tags_callbacks[id]['onRemoveTag'] = settings.onRemoveTag;
        tags_callbacks[id]['onChange'] = settings.onChange;
      }

      var markup = '<div id="' + id + '_tagsinput" class="tagsinput ' + settings.class + '"><div id="' + id + '_addTag">';

      if (settings.interactive) {
        markup = markup + '<input id="'+id+'_tag" value="" data-default="'+settings.defaultText+'" />';
      }

      markup = markup + '</div><div class="tags_clear"></div></div>';

      $(markup).insertAfter(this);

      $(data.holder).css('width',settings.width);
      $(data.holder).css('min-height',settings.height);
      $(data.holder).css('height',settings.height);

      if ($(data.real_input).val()!='') {
        $.fn.tagsInput.importTags($(data.real_input),$(data.real_input).val(),settings.removeText);
      }
      if (settings.interactive) {
        $(data.fake_input).val($(data.fake_input).attr('data-default'));
        $(data.fake_input).css('color',settings.placeholderColor);
            $(data.fake_input).resetAutosize(settings);

        $(data.holder).on('click',data,function(event) {
          $(event.data.fake_input).focus();
        });

        $(data.fake_input).on('focus',data,function(event) {
          if ($(event.data.fake_input).val()==$(event.data.fake_input).attr('data-default')) {
            $(event.data.fake_input).val('');
          }
          $(event.data.fake_input).css('color','#000000');
        });
        
        $('#'+id+"_tagsinput").find('span.tag a').attr("title",settings.removeText);

        if (settings.autocomplete_url != undefined) {
          autocomplete_options = {source: settings.autocomplete_url};
          for (attrname in settings.autocomplete) {
            autocomplete_options[attrname] = settings.autocomplete[attrname];
          }

          if ($.Autocompleter !== undefined) {
            $(data.fake_input).autocomplete(settings.autocomplete_url, settings.autocomplete);
            $(data.fake_input).on('result',data,function(event,data,formatted) {
              if (data) {
                $('#'+id).addTag(data[0] + "",{focus:true,unique:(settings.unique),removeText:(settings.removeText)});
              }
              });
          } else if ($.ui.autocomplete !== undefined) {
            $(data.fake_input).autocomplete(autocomplete_options);
            $(data.fake_input).on('autocompleteselect',data,function(event,ui) {
              $(event.data.real_input).addTag(ui.item.value,{focus:true,unique:(settings.unique),removeText:(settings.removeText)});
              return false;
            });
          }


        } else {
            // if a user tabs out of the field, create a new tag
            // this is only available if autocomplete is not used.
            $(data.fake_input).on('blur',data,function(event) {
              var d = $(this).attr('data-default');
              if ($(event.data.fake_input).val()!='' && $(event.data.fake_input).val()!=d) {
                if( (event.data.minChars <= $(event.data.fake_input).val().length) && (!event.data.maxChars || (event.data.maxChars >= $(event.data.fake_input).val().length)) )
                  $(event.data.real_input).addTag($(event.data.fake_input).val(),{focus:true,unique:(settings.unique),removeText:(settings.removeText)});
              } else {
                $(event.data.fake_input).val($(event.data.fake_input).attr('data-default'));
                $(event.data.fake_input).css('color',settings.placeholderColor);
              }
              return false;
            });

        }
        // if user types a default delimiter like comma,semicolon and then create a new tag
        $(data.fake_input).on('keypress',data,function(event) {
          if (_checkDelimiter(event)) {
              event.preventDefault();
            if( (event.data.minChars <= $(event.data.fake_input).val().length) && (!event.data.maxChars || (event.data.maxChars >= $(event.data.fake_input).val().length)) )
              $(event.data.real_input).addTag($(event.data.fake_input).val(),{focus:true,unique:(settings.unique),removeText:(settings.removeText)});
              $(event.data.fake_input).resetAutosize(settings);
            return false;
          } else if (event.data.autosize) {
                  $(event.data.fake_input).doAutosize(settings);

                }
        });
        //Delete last tag on backspace
        data.removeWithBackspace && $(data.fake_input).on('keydown', function(event)
        {
          if(event.keyCode == 8 && $(this).val() == '')
          {
             event.preventDefault();
             var last_tag = $(this).closest('.tagsinput').find('.tag:last').text();
             var id = $(this).attr('id').replace(/_tag$/, '');
             last_tag = last_tag.replace(/[\s]+x$/, '');
             $('#' + id).removeTag(escape(last_tag));
             $(this).trigger('focus');
          }
        });
        $(data.fake_input).blur();

        //Removes the not_valid class when user changes the value of the fake input
        if(data.unique) {
            $(data.fake_input).on("keydown",function(event){
                if(event.keyCode == 8 || String.fromCharCode(event.which).match(/\w+|[áéíóúÁÉÍÓÚñÑ,/]+/)) {
                    $(this).removeClass('not_valid');
                }
            });
        }
      } // if settings.interactive
    });

    return this;

  };

  $.fn.tagsInput.updateTagsField = function(obj,tagslist) {
    var id = $(obj).attr('id');
    $(obj).val(tagslist.join(delimiter[id]));
  };

  $.fn.tagsInput.importTags = function(obj,val,removeText) {
    if(removeText==null && removeText==undefined && removeText=="")removeText="remove a Tag";
    $(obj).val('');
    var id = $(obj).attr('id');
    var tags = val.split(delimiter[id]);
    $.each(tags,function(index,value){
      $(obj).addTag(value,{focus:false,callback:false,removeText});
    });
    if(tags_callbacks[id] && tags_callbacks[id]['onChange'])
    {
      var f = tags_callbacks[id]['onChange'];
      f.call(obj, obj, tags[i]);
    }
  };

   /**
     * check delimiter Array
     * @param event
     * @returns {boolean}
     * @private
     */
   var _checkDelimiter = function(event){
      var found = false;
      if (event.which == 13) {
         return true;
      }

      if (typeof event.data.delimiter === 'string') {
         if (event.which == event.data.delimiter.charCodeAt(0)) {
            found = true;
         }
      } else {
         $.each(event.data.delimiter, function(index, delimiter) {
            if (event.which == delimiter.charCodeAt(0)) {
               found = true;
            }
         });
      }

      return found;
   }
 })(jQuery);


});