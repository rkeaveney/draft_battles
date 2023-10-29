$(document).ready(function() {
    // Initialize Select2 for each player dropdown
    $('[id^="team1_player_"], [id^="team2_player_"]').select2({
        minimumInputLength: 1,
        language: {
            inputTooShort: function(args) {
                return "";
            }
        },
        ajax: {
            url: "/api/players/search/",
            dataType: 'json',
            delay: 250,
            data: function(params) {
                return {
                    q: params.term,
                };
            },
            processResults: function(data) {
                return {
                    results: $.map(data, function(player) {
                        return {
                            id: player.uid,
                            text: player.name + " " + player.pos + " " + player.years_played
                        };
                    })
                };
            }
        }
    });

    
    // Event listener when a player is selected
    $('[id^="team1_player_"], [id^="team2_player_"]').on('select2:select', function (e) {
        var selectedPlayerId = e.params.data.id;
        var correspondingYearDropdown = $(this).closest('.dropdowns').find('select[name$="_year_' + $(this).attr('id').split('_').pop() + '"]');

        // Get the years for the selected player
        $.get("/api/players/" + selectedPlayerId + "/", function(data) {
            var years = [""];

            for (let i = 1970; i <= 2022; i++) {
                var field_name = "fp_" + i.toString();
                if (data[field_name] != null) {
                    years.push(i);
                }
            }

            // Clear existing options and add the new ones
            correspondingYearDropdown.empty();

            $.each(years, function(index, year) {
                correspondingYearDropdown.append(new Option(year, year));
            });
        });
    });
});
