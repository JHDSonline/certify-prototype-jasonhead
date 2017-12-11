$(document).ready(function() {
  var $editable_table = $('.sba-c-table--editable'),
      $add_button = $editable_table.next('[id$="_add_item"]');
      var previous_values = [];
      var itemID;

      var getItemID = function(e){
        if (typeof e.attr('id') != "undefined") {
          itemID = "#" + e.attr('id').replace('_edit','').replace('_delete','').replace('_save','').replace('_cancel','');
        }
      }

      var calculateTableSummaries = function(table) {
        var table_cols = table.find('thead tr th').length;

        for (var i = 0; i < table_cols; i++) {
          var $table_header = table.find('thead tr th:nth-child(' + (i+1) + ').js-sum');

          // See if there are any sum classes
          if ($table_header.length) {
            var sum = 0;
            // Get total values
            table.find('tbody tr[id$="_data"] td:nth-child(' + (i+1) + ')').each(function(){
              sum += parseInt($(this).text().replace("$", ""));
            });

            if ($table_header.attr("data-info-type") == "usd") {
              sum = "$" + sum;
            }
            else if ($table_header.attr("data-info-type") == "percent") {
              sum = sum + "%";
            }

            table.find('tfoot tr td:nth-child(' + (i+1) + ')')
              .text(sum)
              .attr("data-table-header", $table_header.text());
          }
        }
      }

      $editable_table.on('click', '[id$="_edit"]', function(e){
        e.stopPropagation();
        getItemID($(e.target));

        // Clase the task panels
        $('.sba-c-task-panel-toggle').attr("aria-expanded", "false");
        $('.sba-c-task-panel-content').removeClass('visible');

        // Disabled task panels
        $('.sba-c-task-panel-toggle').attr("disabled", "");

        // Hide data row
        $(itemID + "_data").attr("hidden", "");

        // Show fields
        $(itemID + "_fields").removeAttr("hidden").find('input:first').focus();

        // Store data from fieldset
        previous_values = [];
        $(itemID + "_fields").find('input').each(function(){
          input_id = "#" + $(this).attr('id');
          initial_val = $(this).val();
          previous_values.push([input_id, initial_val]);
        });

        // Disable adding rows while editing a rows
        $add_button.attr("disabled", "");

        // Update data in fields
        return false;
      });

      // Remove table row
      $editable_table.on('click', '[id$="_delete"]', function(e){
        e.stopPropagation();
        var table = "#" + $(this).closest('table').attr('id');
        getItemID($(e.target));
        var confirmed = confirm('Are you sure you want to delete this item?');
        if (confirmed) {
          $(itemID + "_data").remove();
        }
        calculateTableSummaries($(table));
        return false;
      });

      // Save button
      $editable_table.on('click', '[id$="_save"]', function(e){
        e.stopPropagation();
        getItemID($(e.target));
        new_values = [];
        $(itemID + "_fields").find('input').each(function(){
          input_id = "#" + $(this).attr('id');
          if ($(this).hasClass('js-usd')) {
            initial_val = "$" + $(this).val();
          }
          else if ($(this).hasClass('js-percent')) {
            initial_val = $(this).val() + "%";
          }
          else {
            initial_val = $(this).val();
          }
          new_values.push([input_id, initial_val]);
        });

        //// See if any columns need to be summarized, then create one if not created already
        var table = "#" + $(this).closest('table').attr('id');
        var summated_cols = $(table).find('.js-sum').length;
        if ((summated_cols > 0) && ($(table).find('tfoot').length == 0)) {
          $(table).find('thead').after('<tfoot></tfoot>');
          var table_cols = $(table).find('thead tr th').length;

          for (var i = 0; i < table_cols; i++) {
            if (i == 0) {
              $(table).find('tfoot').append('<tr><th>Totals</th></tr>');
            }
            else {
              $(table).find('tfoot tr').append('<td></td>');
            }
          }
        }

        // Update the values
        for (var i = 0; i < new_values.length; i++)
        {
          $(new_values[i][0] + "_text").text(new_values[i][1]);


        }

        calculateTableSummaries($(table));

        getItemID($(e.target));

        // Show the data row
        $(itemID + "_data").removeAttr("hidden");

        // Hide fields
        $(itemID + "_fields").attr("hidden", "");

        // Re-enabled the the add button
        $add_button.removeAttr("disabled", "");

        // Re-enable task panels
        $('.sba-c-task-panel-toggle').removeAttr("disabled");


        return false;
      });


      // Cancel Button
      $editable_table.on('click', '[id$="_cancel"]', function(e){
        e.stopPropagation();
        // Reset the values
        for (var i = 0; i < previous_values.length; i++)
        {
          $(previous_values[i][0]).val(previous_values[i][1]);
        }

        // Show the data row
        $(itemID + "_data").removeAttr("hidden");

        // Re-enable task panels
        $('.sba-c-task-panel-toggle').removeAttr("disabled");

        // Hide fields
        $(itemID + "_fields").attr("hidden", "");

        // If canceling an ADD fields
        if ($(itemID + "_data").find('> *:first-child').text().length < 1) {
          $(e.target).closest('tr').prev('tr').remove();
          $(e.target).closest('tr').remove();
          //$(itemID + "_data").remove();
          //$(itemID + "_fields").remove();
        }

        // Re-enabled the the add button
        $add_button.removeAttr("disabled");

        return false;
      });

      // Add a table row
      $add_button.on('click', function(){

        // Get itemID for the cancel button
        getItemID($(this));

        // Disabled task panels
        $('.sba-c-task-panel-toggle').attr("disabled", "");

        // Only allow adding one row at time.
        $(this).attr("disabled", "");

        // Get some variables
        var table = "#" + $(this).attr('id').replace('_add_item',''),
            table_name = $(this).attr('id').replace('_add_item','');
            row_id_arr = [];

        // Get highest ID
        $(table).find('tbody tr').each(function(){
          var ids = $(this).attr('id')
            .replace(table_name ,'')
            .replace('_fields','')
            .replace('_data','')
            .replace('_tr','');
          row_id_arr.push(ids);
        });

        // Just in case a null state has not been added
        if (row_id_arr.length === 0) {
          row_id_arr = [];
          row_id_arr.push(0);
        }

        // Hide the null row
        $(table).find('tbody tr[id$="0_data"]').attr("hidden", "");

        // Get next ID number and number of rows needed
        var next_id = Math.max.apply(Math,row_id_arr) + 1,
            table_cols = $(table).find('thead tr th').length,
            row_name = table_name + '_tr' + next_id,
            data_row_id = row_name + '_data',
            fields_row_id = row_name + '_fields';

        // Create empty table rows
        $(table).find('tbody')
          .append('<tr class="is-added" id="' + data_row_id + '" hidden></tr>')
          .append('<tr id="' + fields_row_id + '"></tr>');

        // Create the table cells
        for (var i = 0; i < table_cols; i++) {
          var data_header_text = $(table).find('thead tr th:nth-child(' + (i + 1) + ')').text();
          var data_row_th = '<th scope="row" id="' + row_name + '_field' + (i + 1) + '_text" data-table-header="' + data_header_text + '"></th>';
          var data_row_td = '<td id="' + row_name + '_field' + (i + 1) + '_text" data-table-header="' +  data_header_text + '" ></td>'
          var data_row_actions ='\
            <td data-table-header="' +  data_header_text + '" >\
              <div class="sba-c-task-panel">\
                <button type="button" class="usa-button-unstyled sba-c-task-panel-toggle" aria-expanded="false" aria-controls="'+ fields_row_id +'_panel">actions</button>\
                <div id="'+ fields_row_id +'_panel" class="sba-c-task-panel-content">\
                  <ul class="sba-c-task-panel-menu">\
                    <li class="sba-c-task-panel-menu__item">\
                      <a href="#" class="sba-c-task-panel-menu__link" id="'+ row_name +'_edit" aria-controls="'+ fields_row_id +'" aria-expanded="false">Edit this item</a>\
                    </li>\
                    <li class="sba-c-task-panel-menu__item">\
                      <a href="#" class="sba-c-task-panel-menu__link--emergency" id="'+ row_name +'_delete">Delete</a>\
                    </li>\
                  </ul>\
                </div>\
              </div>\
            </td>';

          // Append the table cells
          if (i == 0) {
            $("#" + data_row_id).append(data_row_th); // first
          }
          else if (i == (table_cols - 1)) {
            $("#" + data_row_id).append(data_row_actions); // last
          }
          else {
            $("#" + data_row_id).append(data_row_td); // everything in between
          }
        }

        // Add the form field container
        var form_field_wrapper = '\
          <td colspan="' + table_cols + '">\
            <ul class="sba-c-field-list"></ul>\
            <div class="sba-c-table--editable__actions">\
              <button id="'+ row_name +'_save" class="sba-c-button">OK</button>\
              <a id="' + row_name + '_cancel"  href="#">Cancel</a>\
            </div>\
          </td>';

        // Add the wrapper
        $("#" + fields_row_id).append(form_field_wrapper);

        // Iterate through adding the form inputs
        for (var i = 0; i < table_cols - 1; i++) {
          var $table_header_th = $(table).find('thead tr th:nth-child(' + (i + 1) + ')');
          var input_type = $table_header_th.attr("data-info-type");
          var label_text = $table_header_th.text();
          var field_id = table_name + '_tr' + next_id + '_field' + (i + 1);

          // IMPORTANT: Before creating the gem, we are going to need
          // to fix the file path of the SVG.
          switch (input_type) {
            case "usd":
              var form_input = '\
              <div class="sba-c-input-ornament-container">\
                <div class="sba-c-input-ornament sba-c-input-ornament--left">\
                  <svg aria-hidden="true" class="sba-c-icon">\
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="{{ site.baseurl }}/assets/img/svg-sprite/sprite.svg#dollar-sign"></use>\
                  </svg>\
                </div>\
                <input type="text" id="'+ field_id +'" class="sba-c-input--dollar js-usd">\
              </div>';
              break;
            case "percent":
              var form_input = '\
              <div class="sba-c-input-ornament-container">\
                <div class="sba-c-input-ornament sba-c-input-ornament--right">\
                  <svg aria-hidden="true" class="sba-c-icon">\
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="{{ site.baseurl }}/assets/img/svg-sprite/sprite.svg#percent"></use>\
                  </svg>\
                </div>\
                <input type="number" id="'+ field_id +'" class="sba-u-input-width--percent js-percent">\
              </div>';
              break;
            default:
              var form_input = '<input id="' + field_id + '" type="text">';
          }


          var form_field = '\
            <li>\
              <label for="' + field_id + '">' + label_text + '</label>\
              '+ form_input + '\
            </li>';

          $("#" + fields_row_id + " td ul").append(form_field);
        }

        // Focus on the first field
        $("#" + fields_row_id).find('input:first').focus();

        return false;
      });

      $editable_table.on('click', 'tr.is-added .sba-c-task-panel-toggle', function(e){
        toggler = $(e.target);
        window.toggle_task_panels(toggler);
      });
});
