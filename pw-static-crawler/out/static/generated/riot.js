riot.tag2('user_management', '<div class="row"> <h1 class="ui center aligned header"> User Management Portal </h1> <div id="search_bar" class="column"> <span class="ui search"> <span class="ui icon input"> <input class="prompt" type="text" placeholder="Search Users..."> <i class="search icon"></i> </span> <span class="results"></span> </span> </div> <table class="ui striped table"> <thead> <tr> <th class=""></th> <th>Name</th> <th>Username</th> <th>Email</th> <th>User Type</th> </tr> </thead> <tr> <td class="first_row"> <a data-tooltip="Delete User" data-inverted="" href="#" onclick="$(\'#delete_user_modal\').modal(\'show\')"> <i class="trash icon"></i> </a> </td> <td>John Doe</td> <td>JDoe40</td> <td>john@jdoe.com</td> <td>Benchmark Admin</td> </tr> </table> <div id="delete_user_modal" class="ui mini modal"> <div class="header">Delete User JDoe40?</div> <div class="actions"> <div class="basic grey ui cancel button">Cancel</div> <div class="ui red approve button">Delete User</div> </div> </div> </div>', 'user_management { width: 100%; } user_management h1.ui.center.aligned.header,[data-is="user_management"] h1.ui.center.aligned.header{ margin-top: 0.5em; } user_management .ui.search,[data-is="user_management"] .ui.search{ align-content: right !important; } user_management .first_row,[data-is="user_management"] .first_row{ width: 35px; } user_management .edit.icon,[data-is="user_management"] .edit.icon{ color: #808080; padding-top: 2px; } user_management .trash.icon,[data-is="user_management"] .trash.icon{ color: #808080; } user_management #search_bar,[data-is="user_management"] #search_bar{ text-align: right; } user_management table.ui.striped.table,[data-is="user_management"] table.ui.striped.table{ margin-bottom: 1em; } user_management .ui.right.aligned.container,[data-is="user_management"] .ui.right.aligned.container{ margin-top: 1em; }', '', function(opts) {
        $(document).ready(function () {
            $('.edit').hover(function () {
                $(this).css('color', 'steelblue')
            }, function () {
                $(this).css('color', 'grey')
            });
            $('.trash').hover(function () {
                $(this).css('color', '#B01C2E')
            }, function () {
                $(this).css('color', 'grey')
            });
            $('#delete_user_modal').modal({
                onApprove: function () {
                    window.alert('User Deleted!')
                }
            })
        })
});

riot.tag2('user_switch', '<div id="user_switch_modal" class="ui mini modal"> <i class="close icon"></i> <div class="header">Change User</div> <div class="content"> <div class="field-container"> <form class="ui form" method="POST" action="/su/" ref="form"> <input type="hidden" riot-value="{CSRF_TOKEN}"> <input ref="user_id" class="ui input focus" placeholder="User ID"> </form> </div> </div> <div class="actions"> <div class="ui grey basic deny button">Cancel</div> <div class="ui positive right labeled icon button" onclick="{submit_form}"> Switch User <i class="checkmark icon"></i> </div> </div> </div>', '', '', function(opts) {
        var self = this
        self.on('mount', function(){
            $('#user_switch_modal').modal()
        })
        self.submit_form = function() {
            self.refs.form.submit()
        }
});

riot.tag2('analytics-storage-competitions-usage', '<div class="flex-row"> <select class="ui search multiple selection dropdown" multiple ref="competitions_dropdown"> <i class="dropdown icon"></i> <div class="default text">Select Competitions</div> <div class="menu"> <option each="{competition in competitionsDropdownOptions}" riot-value="{competition.id}">{competition.title}</div> </div> </select> <button class="ui button" onclick="{selectTopFiveBiggestCompetitions}">Select top 5 biggest competitions</button> <button class="ui green button" onclick="{downloadCompetitionsHistory}"> <i class="icon download"></i>Download as CSV </button> <h4 style="margin: 0 0 0 auto">{lastSnapshotDate ? ⁗Last snaphost date: ⁗ + pretty_date(lastSnapshotDate) : ⁗No snapshot has been taken yet⁗}</h4> </div> <div class="chart-container"> <canvas class="big" ref="storage_competitions_usage_chart"></canvas> </div> <div class="ui calendar" ref="table_date_calendar"> <div class="ui input left icon"> <i class="calendar icon"></i> <input type="text"> </div> </div> <div class="chart-container"> <canvas class="big" ref="storage_competitions_usage_pie"></canvas> </div> <button class="ui green button" onclick="{downloadCompetitionsTable}"> <i class="icon download"></i>Download as CSV </button> <table id="storageCompetitionsTable" class="ui selectable sortable celled table"> <thead> <tr> <th is="su-th" data-sort-method="alphanumeric">Competition</th> <th is="su-th" data-sort-method="alphanumeric">Organizer</th> <th is="su-th" class="date" data-sort-method="date">Creation date</th> <th is="su-th" class="bytes" data-sort-method="numeric">Datasets</th> </tr> </thead> <tbody> <tr each="{competitionUsage in competitionsUsageTableData}"> <td><a href="{URLS.COMPETITION_DETAIL(competitionUsage.id)}">{competitionUsage.title}</a></td> <td>{competitionUsage.organizer}</td> <td>{formatDate(competitionUsage.created_when)}</td> <td>{pretty_bytes(competitionUsage.datasets)}</td> </tr> </tbody> </table>', 'analytics-storage-competitions-usage th,[data-is="analytics-storage-competitions-usage"] th{ border-bottom: 2px solid #808080; } analytics-storage-competitions-usage table,[data-is="analytics-storage-competitions-usage"] table{ margin-bottom: 50px; width: 1000px; } analytics-storage-competitions-usage canvas.big,[data-is="analytics-storage-competitions-usage"] canvas.big{ height: 500px !important; width: 1000px !important; } analytics-storage-competitions-usage .date-input,[data-is="analytics-storage-competitions-usage"] .date-input{ display: flex; flex-direction: column; } analytics-storage-competitions-usage .start-date-input,[data-is="analytics-storage-competitions-usage"] .start-date-input{ margin-right: 40px; } analytics-storage-competitions-usage .date-selection,[data-is="analytics-storage-competitions-usage"] .date-selection{ display: flex; justify-content: space-between; flex-direction: row; background: #eee; margin-top: 30px; border-radius: 4px; padding: 10px; width: fit-content; } analytics-storage-competitions-usage .chart-container,[data-is="analytics-storage-competitions-usage"] .chart-container{ min-height: 450px; } analytics-storage-competitions-usage .flex-row,[data-is="analytics-storage-competitions-usage"] .flex-row{ display: flex; flex-direction: row; }', '', function(opts) {
        var self = this;

        self.state = {
            startDate: null,
            endDate: null,
            resolution: null
        };

        let datetime = luxon.DateTime;

        self.lastSnapshotDate = null;
        self.competitionsUsageData = null;
        self.competitionsDropdownOptions = [];
        self.tableSelectedDate = null;
        self.selectedCompetitions = [];
        self.competitionsColor = {};
        self.colors = ["#36a2eb", "#ff6384", "#4bc0c0", "#ff9f40", "#9966ff", "#ffcd56", "#c9cbcf"];
        self.storageCompetitionsUsageChart;
        self.storageCompetitionsUsagePieChart;
        self.competitionsUsageTableData = [];

        self.one("mount", function () {
            self.state.startDate = opts.start_date;
            self.state.endDate = opts.end_date;
            self.state.resolution = opts.resolution;

            $(self.refs.competitions_dropdown).dropdown({
                onAdd: self.addCompetitionToSelection,
                onRemove: self.removeCompetitionFromSelection,
                clearable: true,
                preserveHTML: false,
            });

            $('#storageCompetitionsTable').tablesort();
            $('#storageCompetitionsTable thead th.date').data('sortBy', function(th, td, tablesort) {
                return new Date(td.text());
            });
            $('#storageCompetitionsTable thead th.bytes').data('sortBy', function(th, td, tablesort) {
                const re = /(\d+.?\d*)(\D+)/;
                const found = td.text().match(re);
                const unitToPower = {
                    'B': 0,
                    'KiB': 1,
                    'MiB': 2,
                    'GiB': 3,
                    'TiB': 4,
                    'PiB': 5,
                    'EiB': 6,
                    'ZiB': 7
                };
                const bytes = found[1] * Math.pow(1024, unitToPower[found[2]]);
                return bytes;
            });

            const general_calendar_options = {
                type: 'date',

                formatter: {
                    date: function (date, settings) {
                        return datetime.fromJSDate(date).toISODate();
                    }
                },
            };
            let table_date_specific_options = {
                onChange: function(date, text) {
                    self.tableSelectedDate = date;
                    self.updateCompetitionsTable();
                    self.updateCompetitionsPieChart();
                }
            };
            let table_date_calendar_options = _.assign({}, general_calendar_options, table_date_specific_options);
            $(self.refs.table_date_calendar).calendar(table_date_calendar_options);

            let storageCompetitionsUsageConfig = {
                type: 'line',
                data: {
                    datasets: [],
                },
                options: {
                    responsive: true,
                    interaction: {
                        mode: 'nearest',
                        axis: 'x',
                        intersect: false
                    },
                    scales: {
                        xAxes: [{
                            type: 'time',
                            ticks: {
                                source: 'auto'
                            }
                        }],
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                stepSize: 'auto',
                                callback: function(value, index, values) {
                                    return pretty_bytes(value);
                                }
                            }
                        }]
                    },
                    tooltips: {
                        mode: 'index',
                        intersect: false,
                        position: 'nearest',
                        callbacks: {
                            label: function(tooltipItem, data) {
                                return pretty_bytes(tooltipItem.yLabel);
                            }
                        }
                    }
                }
            };

            self.storageCompetitionsUsageChart = new Chart($(self.refs.storage_competitions_usage_chart), storageCompetitionsUsageConfig);

            let storageCompetitionsUsagePieConfig = {
                type: 'pie',
                data: {
                    labels: [],
                    competitionsId: [],
                    datasets: [
                        {
                            label: 'Competitions distribution',
                            backgroundColor: [],
                            hoverOffset: 4,
                            data: []
                        }
                    ],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'left',
                        },
                        title: {
                            display: true,
                            text: 'Competitions distribution'
                        }
                    },
                    tooltips: {
                        callbacks: {
                            label: function(tooltipItem, data) {
                                const label = data.labels[tooltipItem.index];
                                const value = pretty_bytes(data.datasets[0].data[tooltipItem.index]);
                                return " " + label + ": " + value;
                            }
                        }
                    }
                }
            };

            self.storageCompetitionsUsagePieChart = new Chart($(self.refs.storage_competitions_usage_pie), storageCompetitionsUsagePieConfig);
        });

        self.on("update", function () {
            if (opts.is_visible && (self.state.startDate != opts.start_date || self.state.endDate != opts.end_date || self.state.resolution != opts.resolution)) {
                self.state.startDate = opts.start_date;
                self.state.endDate = opts.end_date;
                self.state.resolution = opts.resolution;
                self.get_competitions_usage(self.state.startDate, self.state.endDate, self.state.resolution);
            }
        });

        self.get_competitions_usage = function(start_date, end_date, resolution) {
            let parameters = {
                start_date: start_date,
                end_date: end_date,
                resolution: resolution
            };
            CODALAB.api.get_competitions_usage(parameters)
                .done(function(data) {
                    self.competitionsUsageData = data["competitions_usage"];
                    self.lastSnapshotDate = data["last_storage_calculation_date"];
                    self.update({lastSnapshotDate: data["last_storage_calculation_date"]});
                    self.updateCompetitionsSelectionDropdown();
                    self.updateCompetitionTableCalendar(data["competitions_usage"]);
                    self.updateCompetitionsChart();
                    self.updateCompetitionsPieChart();
                    self.updateCompetitionsTable();
                })
                .fail(function(error) {
                    toastr.error("Could not load storage analytics data");
                });
        }

        self.updateCompetitionsSelectionDropdown = function () {

            let competitionsOptions = [];
            if(Object.keys(self.competitionsUsageData).length > 0) {
                const competitions = Object.values(self.competitionsUsageData)[0];
                competitionsOptions = Object.entries(competitions).map(([id, { title }]) => ({ id, title }));
            }

            self.competitionsDropdownOptions = competitionsOptions;
            $(self.refs.competitions_dropdown).dropdown('change values', competitionsOptions);
            self.update({competitionsDropdownOptions: competitionsOptions});
        }

        self.updateCompetitionTableCalendar = function(data) {

            const minDate = new Date(Object.keys(data).reduce((acc, cur) => new Date(acc) < new Date(cur) ? acc : cur, '9999-12-31'));
            const maxDate = new Date(Object.keys(data).reduce((acc, cur) => new Date(acc) > new Date(cur) ? acc : cur, '0000-00-00'));
            $(self.refs.table_date_calendar).calendar('setting', 'minDate', minDate);
            $(self.refs.table_date_calendar).calendar('setting', 'maxDate', maxDate);

            self.tableSelectedDate = maxDate;
            $(self.refs.table_date_calendar).calendar('set date', maxDate);
            $(self.refs.table_date_calendar).calendar('refresh');
        }

        self.addCompetitionToSelection = function(value, text, $addedItem) {
            if(Object.keys(self.competitionsUsageData).length > 0) {
                self.selectedCompetitions.push(value);
                let competitionUsage = [];
                for (let [dateString, competitions] of Object.entries(self.competitionsUsageData)) {
                    for (let [competitionId, competition] of Object.entries(competitions)) {
                        if (competitionId == value) {
                            competitionUsage.push({x: new Date(dateString), y: competition.datasets * 1024});
                        }
                    }
                }
                const competitions = Object.values(self.competitionsUsageData)[0];
                const competitionTitle = competitions[value].title;
                if(!self.competitionsColor.hasOwnProperty(value)) {
                    self.competitionsColor[value] = self.colors[Object.keys(self.competitionsColor).length % self.colors.length];
                }
                const color = self.competitionsColor[value];

                self.storageCompetitionsUsageChart.data.datasets.push({
                    competitionId: value,
                    label: competitionTitle,
                    data: competitionUsage,
                    backgroundColor: color,
                    borderWidth: 1,
                    lineTension: 0,
                    fill: false
                });
                self.storageCompetitionsUsageChart.update();

                let selectedDate = self.tableSelectedDate;
                if (!selectedDate) {
                    selectedDate = new Date(Object.keys(self.competitionsUsageData).reduce((acc, cur) => new Date(acc) > new Date(cur) ? acc : cur , '0000-00-00'));
                }
                const selectedDateString = selectedDate.getUTCFullYear() + "-" + (selectedDate.getUTCMonth()+1) + "-" + selectedDate.getUTCDate();
                const closestOlderDateString = Object.keys(self.competitionsUsageData).reduce((acc, cur) => (Math.abs(new Date(selectedDateString) - new Date(cur)) < Math.abs(new Date(selectedDateString) - new Date(acc)) && (new Date(selectedDateString) - new Date(cur) >= 0)) ? cur : acc, '9999-12-31');
                const competitionsAtSelectedDate = self.competitionsUsageData[closestOlderDateString];
                const selectedCompetitions = Object.keys(competitionsAtSelectedDate).filter(date => self.selectedCompetitions.includes(date)).reduce((competition, date) => ({ ...competition, [date]: competitionsAtSelectedDate[date] }), {});

                const {labels, competitionsId, data} = self.formatDataForCompetitionsPieChart(selectedCompetitions);
                self.storageCompetitionsUsagePieChart.data.labels = labels;
                self.storageCompetitionsUsagePieChart.data.competitionsId = competitionsId;
                self.storageCompetitionsUsagePieChart.data.datasets[0].data = data;
                self.storageCompetitionsUsagePieChart.data.datasets[0].labels = labels;
                self.storageCompetitionsUsagePieChart.data.datasets[0].backgroundColor = self.listOfColors(data.length);
                self.storageCompetitionsUsagePieChart.update();
            }
        }

        self.formatDataForCompetitionsPieChart = function (data) {
            var labels = [];
            var competitionsId = [];
            var formattedData = [];

            const competitionArray = Object.entries(data).map(([key, value]) => ({ ...value, id: key }));
            competitionArray.sort((a, b) => b.datasets - a.datasets);
            for (const competition of competitionArray) {
                labels.push(competition.title);
                competitionsId.push(competition.id);
                formattedData.push(competition.datasets * 1024);
            }

            return {labels: labels, competitionsId: competitionsId, data: formattedData};
        }

        self.listOfColors = function(arrayLength) {
            return Array.apply(null, Array(arrayLength)).map(function (x, i) { return self.colors[i%self.colors.length]; })
        }

        self.removeCompetitionFromSelection = function(value, text, $removedItem) {

            const indexToRemoveInSelected = self.selectedCompetitions.findIndex(competitionId => competitionId == value);
            if (indexToRemoveInSelected !== -1) {
                self.selectedCompetitions.splice(indexToRemoveInSelected, 1);
            }

            self.competitionsColor = {};
            for(const competitionId of self.selectedCompetitions) {
                self.competitionsColor[competitionId] = self.colors[Object.keys(self.competitionsColor).length % self.colors.length];
            }

            let indexToRemove = self.storageCompetitionsUsageChart.data.datasets.findIndex(dataset => dataset.competitionId == value);
            if (indexToRemove !== -1) {
                self.storageCompetitionsUsageChart.data.datasets.splice(indexToRemove, 1);
                for(let dataset of self.storageCompetitionsUsageChart.data.datasets) {
                    dataset.backgroundColor = self.competitionsColor[dataset.competitionId];
                }
                self.storageCompetitionsUsageChart.update();
            }

            indexToRemove = self.storageCompetitionsUsagePieChart.data.competitionsId.findIndex(id => id == value);
            if (indexToRemove !== -1) {
                self.storageCompetitionsUsagePieChart.data.labels.splice(indexToRemove, 1);
                self.storageCompetitionsUsagePieChart.data.competitionsId.splice(indexToRemove, 1);
                self.storageCompetitionsUsagePieChart.data.datasets[0].data.splice(indexToRemove, 1);
                self.storageCompetitionsUsagePieChart.data.datasets[0].backgroundColor.splice(indexToRemove, 1);
                self.storageCompetitionsUsagePieChart.data.datasets[0].backgroundColor = self.storageCompetitionsUsagePieChart.data.competitionsId.map(competitionId => self.competitionsColor[competitionId]);
                self.storageCompetitionsUsagePieChart.update();
            }
        }

        self.selectTopFiveBiggestCompetitions = function () {
            let selectCompetitions = [];
            if (Object.keys(self.competitionsUsageData).length > 0) {
                const mostRecentDateString = Object.keys(self.competitionsUsageData).reduce((acc, cur) => new Date(acc) > new Date(cur) ? acc : cur );
                let competitions = Object.entries(self.competitionsUsageData[mostRecentDateString]);
                competitions.sort((a, b) => b[1].datasets - a[1].datasets);
                selectCompetitions = competitions.slice(0, 5).map(([id]) => id);
            }
            for(const competitionId of selectCompetitions) {
                $(self.refs.competitions_dropdown).dropdown('set selected', competitionId);
            }
        }

        self.updateCompetitionsChart = function() {
            if(Object.keys(self.competitionsUsageData).length > 0) {
                const selectedCompetitions = Object.fromEntries(
                    Object.entries(self.competitionsUsageData).map(([dateString, competitions]) => [
                        dateString,
                        Object.fromEntries(
                            Object.entries(competitions).filter(([competitionId]) => self.selectedCompetitions.includes(competitionId))
                        )
                    ])
                );

                const competitionsUsage = {};
                for (let [dateString, competitions] of Object.entries(selectedCompetitions)) {
                    for (let [competitionId, competition] of Object.entries(competitions)) {
                        if (!competitionsUsage.hasOwnProperty(competitionId)) {
                            competitionsUsage[competitionId] = [];
                        }
                        competitionsUsage[competitionId].push({x: new Date(dateString), y: competition.datasets * 1024});
                    }
                }

                self.storageCompetitionsUsageChart.data.datasets = [];
                let index = 0;
                for(let [competitionId, dataset] of Object.entries(competitionsUsage)) {
                    const color = self.colors[index % self.colors.length];
                    const title = Object.values(self.competitionsUsageData)[0][competitionId].title;
                    self.storageCompetitionsUsageChart.data.datasets.push({
                        competitionId: competitionId,
                        label: title,
                        data: dataset,
                        backgroundColor: color,
                        borderWidth: 1,
                        lineTension: 0,
                        fill: false
                    });
                    index++;
                }

                self.storageCompetitionsUsageChart.update();
            }
        }

        self.updateCompetitionsPieChart = function() {
            let selectedDate = self.tableSelectedDate;
            if (!selectedDate) {
                selectedDate = new Date(Object.keys(self.competitionsUsageData).reduce((acc, cur) => new Date(acc) > new Date(cur) ? acc : cur , '0000-00-00'));
            }
            const selectedDateString = selectedDate.getUTCFullYear() + "-" + (selectedDate.getUTCMonth()+1) + "-" + selectedDate.getUTCDate();
            const closestOlderDateString = Object.keys(self.competitionsUsageData).reduce((acc, cur) => (Math.abs(new Date(selectedDateString) - new Date(cur)) < Math.abs(new Date(selectedDateString) - new Date(acc)) && (new Date(selectedDateString) - new Date(cur) >= 0)) ? cur : acc, '9999-12-31');
            const competitionsAtSelectedDate = self.competitionsUsageData[closestOlderDateString];
            const selectedCompetitions = Object.keys(competitionsAtSelectedDate).filter(date => self.selectedCompetitions.includes(date)).reduce((competition, date) => ({ ...competition, [date]: competitionsAtSelectedDate[date] }), {});

            const {labels, competitionsId, data} = self.formatDataForCompetitionsPieChart(selectedCompetitions);
            self.storageCompetitionsUsagePieChart.data.labels = labels;
            self.storageCompetitionsUsagePieChart.data.competitionsId = competitionsId;
            self.storageCompetitionsUsagePieChart.data.datasets[0].data = data;
            self.storageCompetitionsUsagePieChart.data.datasets[0].labels = labels;
            self.storageCompetitionsUsagePieChart.data.datasets[0].backgroundColor = self.listOfColors(data.length);
            self.storageCompetitionsUsagePieChart.update();
        }

        self.updateCompetitionsTable = function() {
            const data = self.competitionsUsageData;
            let competitionsUsageTableData = [];
            if (Object.keys(data).length > 0) {
                let selectedDate = self.tableSelectedDate;
                if (!selectedDate) {
                    selectedDate = new Date(Object.keys(data).reduce((acc, cur) => new Date(acc) > new Date(cur) ? acc : cur , '0000-00-00'));
                }
                const selectedDateString = selectedDate.getUTCFullYear() + "-" + (selectedDate.getUTCMonth()+1) + "-" + selectedDate.getUTCDate();
                const closestOlderDateString = Object.keys(data).reduce((acc, cur) => (Math.abs(new Date(selectedDateString) - new Date(cur)) < Math.abs(new Date(selectedDateString) - new Date(acc)) && (new Date(selectedDateString) - new Date(cur) >= 0)) ? cur : acc, '9999-12-31');
                const competitions = data[closestOlderDateString];
                Object.entries(competitions).forEach(keyValue => {
                    const [competitionId, competition] = keyValue;
                    competitionsUsageTableData.push({
                        'id': competitionId,
                        'title': competition.title,
                        'organizer': competition.organizer,
                        'created_when': new Date(competition.created_when),
                        'datasets': competition.datasets * 1024
                    });
                });
                self.update({competitionsUsageTableData: competitionsUsageTableData});
            }
        }

        self.formatDate = function(date) {
            return datetime.fromJSDate(date).toISODate();
        }

        self.downloadCompetitionsHistory = function() {
            var csv = [];

            const competitions = Object.values(self.competitionsUsageData)[0];
            const competitions_id = Object.entries(competitions).map(([id, { title }]) => (id));
            const competitions_name = Object.entries(competitions).map(([id, { title }]) => (title));
            csv.push("," + competitions_id.join(","));
            csv.push("," + competitions_name.join(","));

            sorted_dates = Object.keys(self.competitionsUsageData).sort(function(a, b) {return new Date(a) - new Date(b)});
            for (const date of sorted_dates) {
                let points = [date];
                for (const id of competitions_id) {
                    points.push(self.competitionsUsageData[date][id]['datasets'] * 1024);
                }
                csv.push(points.join(","));
            }

            const blob = new Blob([csv.join('\n')], { type: 'text/csv;charset=utf-8;' });
            saveAs(blob, "competitions_usage_history.csv");
        }

        self.downloadCompetitionsTable = function() {
            var csv = [];

            let categories = ['Competition', 'Organizer', 'Creation date', 'Datasets'];
            csv.push(categories.join(","));

            for (const competition of self.competitionsUsageTableData) {
                const points = [
                    competition.title,
                    competition.organizer,
                    competition.created_when.toLocaleString(),
                    competition.datasets * 1024
                ];
                csv.push(points.join(","));
            }

            const blob = new Blob([csv.join('\n')], { type: 'text/csv;charset=utf-8;' });
            saveAs(blob, "competitions_table.csv");
        }
});
riot.tag2('analytics-storage-usage-history', '<div class="flex-row"> <button class="ui green button" onclick="{downloadUsageHistory}"> <i class="icon download"></i>Download as CSV </button> <h4 style="margin: 0 0 0 auto">{lastSnapshotDate ? ⁗Last snaphost date: ⁗ + pretty_date(lastSnapshotDate) : ⁗No snapshot has been taken yet⁗}</h4> </div> <div class="chart-container"> <canvas class="big" ref="storage_usage_history_chart"></canvas> </div>', 'analytics-storage-usage-history .chart-container,[data-is="analytics-storage-usage-history"] .chart-container{ min-height: 450px; } analytics-storage-usage-history .flex-row,[data-is="analytics-storage-usage-history"] .flex-row{ display: flex; flex-direction: row; }', '', function(opts) {
        var self = this;

        self.state = {
            startDate: null,
            endDate: null,
            resolution: null
        };
        self.storageUsageHistoryData = null;
        self.storageUsageChart = null;
        self.lastSnapshotDate = null;

        self.one("mount", function () {
            self.state.startDate = opts.start_date;
            self.state.endDate = opts.end_date;
            self.state.resolution = opts.resolution;

            let storageUsageConfig = {
                type: 'line',
                data: {
                    datasets: [
                        {
                            label: 'Total usage',
                            data: [],
                            borderColor: 'rgb(255, 99, 132)',
                            borderWidth: 1,
                            lineTension: 0
                        },
                        {
                            label: 'Competitions usage',
                            data: [],
                            borderColor: 'rgb(255, 164, 74)',
                            borderWidth: 1,
                            lineTension: 0
                        },
                        {
                            label: 'Users usage',
                            data: [],
                            borderColor: 'rgb(54, 162, 235)',
                            borderWidth: 1,
                            lineTension: 0
                        },
                        {
                            label: 'Administration usage',
                            data: [],
                            borderColor: 'rgb(153, 102, 255)',
                            borderWidth: 1,
                            lineTension: 0
                        },
                        {
                            label: 'Orphaned files usage',
                            data: [],
                            borderColor: 'rgb(228, 229, 231)',
                            borderWidth: 1,
                            lineTension: 0
                        }
                    ],
                },
                options: {
                    responsive: true,
                    interaction: {
                        mode: 'nearest',
                        axis: 'x',
                        intersect: false
                    },
                    scales: {
                        xAxes: [{
                            type: 'time',
                            ticks: {
                                source: 'auto'
                            }
                        }],
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                stepSize: 'auto',
                                callback: function(value, index, values) {
                                    return pretty_bytes(value);
                                }
                            }
                        }]
                    },
                    tooltips: {
                        mode: 'index',
                        intersect: false,
                        position: 'nearest',
                        callbacks: {
                            label: function(tooltipItem, data) {
                                return pretty_bytes(tooltipItem.yLabel);
                            }
                        }
                    }
                }
            };
            self.storageUsageChart = new Chart($(self.refs.storage_usage_history_chart), storageUsageConfig);
        });

        self.on("update", function () {
            if (opts.is_visible && (self.state.startDate != opts.start_date || self.state.endDate != opts.end_date || self.state.resolution != opts.resolution)) {
                self.state.startDate = opts.start_date;
                self.state.endDate = opts.end_date;
                self.state.resolution = opts.resolution;
                self.get_storage_usage_history(self.state.startDate, self.state.endDate, self.state.resolution);
            }
        });

        self.get_storage_usage_history = function(start_date, end_date, resolution) {
            let parameters = {
                start_date: start_date,
                end_date: end_date,
                resolution: resolution
            };
            CODALAB.api.get_storage_usage_history(parameters)
                .done(function(data) {
                    self.storageUsageHistoryData = data["storage_usage_history"];
                    self.lastSnapshotDate = data["last_storage_calculation_date"];
                    self.update({lastSnapshotDate: data["last_storage_calculation_date"]});
                    self.update_storage_usage_history_chart(data["storage_usage_history"]);
                })
                .fail(function(error) {
                    toastr.error("Could not load storage analytics data");
                });
        }

        self.update_storage_usage_history_chart = function(data) {
            var list_usages = {};
            for (let [date, usages] of Object.entries(data)) {
                for (let [usage_label, usage] of Object.entries(usages)) {
                    if (!list_usages.hasOwnProperty(usage_label)) {
                        list_usages[usage_label] = [];
                    }
                    list_usages[usage_label].push({x: new Date(date), y: usage * 1024});
                }
            }
            for (const [index, usage_label] of Object.entries(Object.keys(list_usages))) {
                list_usages[usage_label].sort(function(a, b) {return a.x - b.x;});
                self.storageUsageChart.data.datasets[index].data = list_usages[usage_label];
            }
            self.storageUsageChart.update();
        }

        self.downloadUsageHistory = function() {
            var csv = [];

            let categories = ['Competitions', 'Users', 'Administration', 'Orphaned files', 'Total'];
            csv.push("," + categories.join(","));

            sorted_dates = Object.keys(self.storageUsageHistoryData).sort(function(a, b) {return new Date(a) - new Date(b)});
            for (const date of sorted_dates) {
                let points = [
                    date,
                    self.storageUsageHistoryData[date]['competitions_usage'] * 1024,
                    self.storageUsageHistoryData[date]['users_usage'] * 1024,
                    self.storageUsageHistoryData[date]['admin_usage'] * 1024,
                    self.storageUsageHistoryData[date]['orphaned_file_usage'] * 1024,
                    self.storageUsageHistoryData[date]['total_usage'] * 1024
                ];
                csv.push(points.join(","));
            }

            const blob = new Blob([csv.join('\n')], { type: 'text/csv;charset=utf-8;' });
            saveAs(blob, "storage_usage_history.csv");
        }
});
riot.tag2('analytics-storage-users-usage', '<div class="flex-row"> <select class="ui search multiple selection dropdown" multiple ref="users_dropdown"> <i class="dropdown icon"></i> <div class="default text">Select Users</div> <div class="menu"> <option each="{user in usersDropdownOptions}" riot-value="{user.id}">{user.name}</div> </div> </select> <button class="ui button" onclick="{selectTopFiveBiggestUsers}">Select top 5 biggest users</button> <button class="ui green button" onclick="{downloadUsersHistory}"> <i class="icon download"></i>Download as CSV </button> <h4 style="margin: 0 0 0 auto">{lastSnapshotDate ? ⁗Last snaphost date: ⁗ + pretty_date(lastSnapshotDate) : ⁗No snapshot has been taken yet⁗}</h4> </div> <div class="chart-container"> <canvas class="big" ref="storage_users_usage_chart"></canvas> </div> <div class="ui calendar" ref="users_table_date_calendar"> <div class="ui input left icon"> <i class="calendar icon"></i> <input type="text"> </div> </div> <div style="display: flex; flex-direction: row"> <div class="chart-container" style="width: 60%"> <canvas ref="storage_users_usage_pie"></canvas> </div> <div class="chart-container" style="width: 40%; padding-left: 30px"> <canvas ref="storage_users_usage_pie_details"></canvas> </div> </div> <button class="ui green button" onclick="{downloadUsersTable}"> <i class="icon download"></i>Download as CSV </button> <table id="storageUsersTable" class="ui selectable sortable celled table"> <thead> <tr> <th is="su-th" data-sort-method="alphanumeric">User</th> <th is="su-th" class="date" data-sort-method="date">Joined at</th> <th is="su-th" class="bytes" data-sort-method="numeric">Datasets</th> <th is="su-th" class="bytes" data-sort-method="numeric">Submissions</th> <th is="su-th" class="bytes default-sort" data-sort-method="numeric">Total</th> </tr> </thead> <tbody> <tr each="{userUsage in usersUsageTableData}"> <td>{userUsage.name}</td> <td>{formatDate(userUsage.date_joined)}</td> <td>{pretty_bytes(userUsage.datasets)}</td> <td>{pretty_bytes(userUsage.submissions)}</td> <td>{pretty_bytes(userUsage.datasets + userUsage.submissions)}</td> </tr> </tbody> </table>', 'analytics-storage-users-usage th,[data-is="analytics-storage-users-usage"] th{ border-bottom: 2px solid #808080; } analytics-storage-users-usage table,[data-is="analytics-storage-users-usage"] table{ margin-bottom: 50px; width: 1000px; } analytics-storage-users-usage canvas.big,[data-is="analytics-storage-users-usage"] canvas.big{ height: 500px !important; width: 1000px !important; } analytics-storage-users-usage .date-input,[data-is="analytics-storage-users-usage"] .date-input{ display: flex; flex-direction: column; } analytics-storage-users-usage .start-date-input,[data-is="analytics-storage-users-usage"] .start-date-input{ margin-right: 40px; } analytics-storage-users-usage .date-selection,[data-is="analytics-storage-users-usage"] .date-selection{ display: flex; justify-content: space-between; flex-direction: row; background: #eee; margin-top: 30px; border-radius: 4px; padding: 10px; width: fit-content; } analytics-storage-users-usage .chart-container,[data-is="analytics-storage-users-usage"] .chart-container{ min-height: 450px; } analytics-storage-users-usage .flex-row,[data-is="analytics-storage-users-usage"] .flex-row{ display: flex; flex-direction: row; }', '', function(opts) {
        var self = this;

        self.state = {
            startDate: null,
            endDate: null,
            resolution: null
        };

        let datetime = luxon.DateTime;

        self.lastSnapshotDate = null;
        self.usersUsageData = null;
        self.usersDropdownOptions = [];
        self.usersTableSelectedDate = null;
        self.selectedUsers = [];
        self.usersColor = {};
        self.colors = ["#36a2eb", "#ff6384", "#4bc0c0", "#ff9f40", "#9966ff", "#ffcd56", "#c9cbcf"];
        self.storageUsersUsageChart;
        self.storageUsersUsagePieChart;
        self.storageUsersUsageDetailedPieChart;
        self.usersUsageTableData = [];
        self.selectedUserId = null;

        self.one("mount", function () {
            self.state.startDate = opts.start_date;
            self.state.endDate = opts.end_date;
            self.state.resolution = opts.resolution;

            $(self.refs.users_dropdown).dropdown({
                onAdd: self.addUserToSelection,
                onRemove: self.removeUserFromSelection,
                clearable: true,
                preserveHTML: false,
            });

            $('#storageUsersTable').tablesort();
            $('#storageUsersTable thead th.date').data('sortBy', function(th, td, tablesort) {
                return new Date(td.text());
            });
            $('#storageUsersTable thead th.bytes').data('sortBy', function(th, td, tablesort) {
                const re = /(\d+.?\d*)(\D+)/;
                const found = td.text().match(re);
                const unitToPower = {
                    'B': 0,
                    'KiB': 1,
                    'MiB': 2,
                    'GiB': 3,
                    'TiB': 4,
                    'PiB': 5,
                    'EiB': 6,
                    'ZiB': 7
                };
                const bytes = found[1] * Math.pow(1024, unitToPower[found[2]]);
                return bytes;
            });

            const general_calendar_options = {
                type: 'date',

                formatter: {
                    date: function (date, settings) {
                        return datetime.fromJSDate(date).toISODate();
                    }
                },
            };
            let users_table_date_specific_options = {
                onChange: function(date, text) {
                    self.usersTableSelectedDate = date;
                    self.updateUsersTable();
                    self.updateUsersPieChart();
                }
            };
            let users_table_date_calendar_options = _.assign({}, general_calendar_options, users_table_date_specific_options);
            $(self.refs.users_table_date_calendar).calendar(users_table_date_calendar_options);

            let storageUsersUsageConfig = {
                type: 'line',
                data: {
                    datasets: [],
                },
                options: {
                    responsive: true,
                    interaction: {
                        mode: 'nearest',
                        axis: 'x',
                        intersect: false
                    },
                    scales: {
                        xAxes: [{
                            type: 'time',
                            ticks: {
                                source: 'auto'
                            }
                        }],
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                stepSize: 'auto',
                                callback: function(value, index, values) {
                                    return pretty_bytes(value);
                                }
                            }
                        }]
                    },
                    tooltips: {
                        mode: 'index',
                        intersect: false,
                        position: 'nearest',
                        callbacks: {
                            label: function(tooltipItem, data) {
                                return pretty_bytes(tooltipItem.yLabel);
                            }
                        }
                    }
                }
            };

            self.storageUsersUsageChart = new Chart($(self.refs.storage_users_usage_chart), storageUsersUsageConfig);

            let storageUsersUsagePieConfig = {
                type: 'pie',
                data: {
                    labels: [],
                    usersId: [],
                    datasets: [
                        {
                            label: 'Users distribution',
                            backgroundColor: [],
                            hoverOffset: 4,
                            data: []
                        }
                    ],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'left',
                        }
                    },
                    title: {
                        display: true,
                        text: 'Users distribution'
                    },
                    tooltips: {
                        callbacks: {
                            label: function(tooltipItem, data) {
                                const label = data.labels[tooltipItem.index];
                                const value = pretty_bytes(data.datasets[0].data[tooltipItem.index]);
                                return " " + label + ": " + value;
                            }
                        }
                    },
                    onClick: self.onStorageUsersUsagePieChartClick
                }
            };

            self.storageUsersUsagePieChart = new Chart($(self.refs.storage_users_usage_pie), storageUsersUsagePieConfig);

            const storageUsersDetailedUsagePieConfig = {
                type: 'pie',
                data: {
                    labels: [],
                    datasets: [
                        {
                            label: 'User details',
                            backgroundColor: [],
                            hoverOffset: 4,
                            data: []
                        }
                    ],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        }
                    },
                    title: {
                        display: true,
                        text: 'User details'
                    },
                    tooltips: {
                        callbacks: {
                            label: function(tooltipItem, data) {
                                const label = data.labels[tooltipItem.index];
                                const value = pretty_bytes(data.datasets[0].data[tooltipItem.index]);
                                return " " + label + ": " + value;
                            }
                        }
                    }
                }
            };
            self.storageUsersUsageDetailedPieChart = new Chart($(self.refs.storage_users_usage_pie_details), storageUsersDetailedUsagePieConfig);
        });

        self.on("update", function () {
            if (opts.is_visible && (self.state.startDate != opts.start_date || self.state.endDate != opts.end_date || self.state.resolution != opts.resolution)) {
                self.state.startDate = opts.start_date;
                self.state.endDate = opts.end_date;
                self.state.resolution = opts.resolution;
                self.get_users_usage(self.state.startDate, self.state.endDate, self.state.resolution);
            }
        });

        self.get_users_usage = function(start_date, end_date, resolution) {
            let parameters = {
                start_date: start_date,
                end_date: end_date,
                resolution: resolution
            };
            CODALAB.api.get_users_usage(parameters)
                .done(function(data) {
                    self.usersUsageData = data["users_usage"];
                    self.lastSnapshotDate = data["last_storage_calculation_date"];
                    self.update({lastSnapshotDate: data["last_storage_calculation_date"]});
                    self.updateUsersSelectionDropdown();
                    self.updateUsersTableCalendar(data["users_usage"]);
                    self.updateUsersChart();
                    self.updateUsersPieChart();
                    self.updateUsersTable();
                })
                .fail(function(error) {
                    toastr.error("Could not load storage analytics data");
                });
        }

        self.updateUsersSelectionDropdown = function () {

            let usersOptions = [];
            if(Object.keys(self.usersUsageData).length > 0) {
                const users = Object.values(self.usersUsageData)[0];
                usersOptions = Object.entries(users).map(([id, { name }]) => ({ id, name }));
            }

            self.usersDropdownOptions = usersOptions;
            $(self.refs.users_dropdown).dropdown('change values', usersOptions);
            self.update({usersDropdownOptions: usersOptions});
        }

        self.updateUsersTableCalendar = function(data) {

            const minDate = new Date(Object.keys(data).reduce((acc, cur) => new Date(acc) < new Date(cur) ? acc : cur, '9999-12-31'));
            const maxDate = new Date(Object.keys(data).reduce((acc, cur) => new Date(acc) > new Date(cur) ? acc : cur, '0000-00-00'));
            $(self.refs.users_table_date_calendar).calendar('setting', 'minDate', minDate);
            $(self.refs.users_table_date_calendar).calendar('setting', 'maxDate', maxDate);

            self.usersTableSelectedDate = maxDate;
            $(self.refs.users_table_date_calendar).calendar('set date', maxDate);
            $(self.refs.users_table_date_calendar).calendar('refresh');
        }

        self.addUserToSelection = function(value, text, $addedItem) {
            if(Object.keys(self.usersUsageData).length > 0) {
                self.selectedUsers.push(value);
                let userUsage = [];
                for (let [dateString, users] of Object.entries(self.usersUsageData)) {
                    for (let [userId, user] of Object.entries(users)) {
                        if (userId == value) {
                            userUsage.push({x: new Date(dateString), y: user.datasets * 1024});
                        }
                    }
                }
                const users = Object.values(self.usersUsageData)[0];
                const userName = users[value].name;
                if(!self.usersColor.hasOwnProperty(value)) {
                    self.usersColor[value] = self.colors[Object.keys(self.usersColor).length % self.colors.length];
                }
                const color = self.usersColor[value];

                self.storageUsersUsageChart.data.datasets.push({
                    userId: value,
                    label: userName,
                    data: userUsage,
                    backgroundColor: color,
                    borderWidth: 1,
                    lineTension: 0,
                    fill: false
                });
                self.storageUsersUsageChart.update();

                let selectedDate = self.usersTableSelectedDate;
                if (!selectedDate) {
                    selectedDate = new Date(Object.keys(self.usersUsageData).reduce((acc, cur) => new Date(acc) > new Date(cur) ? acc : cur , '0000-00-00'));
                }
                const selectedDateString = selectedDate.getUTCFullYear() + "-" + (selectedDate.getUTCMonth()+1) + "-" + selectedDate.getUTCDate();
                const closestOlderDateString = Object.keys(self.usersUsageData).reduce((acc, cur) => (Math.abs(new Date(selectedDateString) - new Date(cur)) < Math.abs(new Date(selectedDateString) - new Date(acc)) && (new Date(selectedDateString) - new Date(cur) >= 0)) ? cur : acc, '9999-12-31');
                const usersAtSelectedDate = self.usersUsageData[closestOlderDateString];
                const selectedUsers = Object.keys(usersAtSelectedDate).filter(date => self.selectedUsers.includes(date)).reduce((user, date) => ({ ...user, [date]: usersAtSelectedDate[date] }), {});

                const {labels, usersId, data} = self.formatDataForUsersPieChart(selectedUsers);
                self.storageUsersUsagePieChart.data.labels = labels;
                self.storageUsersUsagePieChart.data.usersId = usersId;
                self.storageUsersUsagePieChart.data.datasets[0].data = data;
                self.storageUsersUsagePieChart.data.datasets[0].labels = labels;
                self.storageUsersUsagePieChart.data.datasets[0].backgroundColor = self.listOfColors(data.length);
                self.storageUsersUsagePieChart.update();
            }
        }

        self.formatDataForUsersPieChart = function (data) {
            var labels = [];
            var usersId = [];
            var formattedData = [];

            const userArray = Object.entries(data).map(([key, value]) => ({ ...value, id: key }));
            userArray.sort((a, b) => (b.datasets + b.submissions) - (a.datasets + a.submissions));
            for (const user of userArray) {
                labels.push(user.name);
                usersId.push(user.id);
                formattedData.push((user.datasets + user.submissions) * 1024);
            }

            return {labels: labels, usersId: usersId, data: formattedData};
        }

        self.listOfColors = function(arrayLength) {
            return Array.apply(null, Array(arrayLength)).map(function (x, i) { return self.colors[i%self.colors.length]; })
        }

        self.removeUserFromSelection = function(value, text, $removedItem) {

            const indexToRemoveInSelected = self.selectedUsers.findIndex(userId => userId == value);
            if (indexToRemoveInSelected !== -1) {
                self.selectedUsers.splice(indexToRemoveInSelected, 1);
            }

            self.usersColor = {};
            for(const userId of self.selectedUsers) {
                self.usersColor[userId] = self.colors[Object.keys(self.usersColor).length % self.colors.length];
            }

            let indexToRemove = self.storageUsersUsageChart.data.datasets.findIndex(dataset => dataset.userId == value);
            if (indexToRemove !== -1) {
                self.storageUsersUsageChart.data.datasets.splice(indexToRemove, 1);
                for(let dataset of self.storageUsersUsageChart.data.datasets) {
                    dataset.backgroundColor = self.usersColor[dataset.userId];
                }
                self.storageUsersUsageChart.update();
            }

            indexToRemove = self.storageUsersUsagePieChart.data.usersId.findIndex(id => id == value);
            if (indexToRemove !== -1) {
                self.storageUsersUsagePieChart.data.labels.splice(indexToRemove, 1);
                self.storageUsersUsagePieChart.data.usersId.splice(indexToRemove, 1);
                self.storageUsersUsagePieChart.data.datasets[0].data.splice(indexToRemove, 1);
                self.storageUsersUsagePieChart.data.datasets[0].backgroundColor.splice(indexToRemove, 1);
                self.storageUsersUsagePieChart.data.datasets[0].backgroundColor = self.storageUsersUsagePieChart.data.usersId.map(userId => self.usersColor[userId]);
                self.storageUsersUsagePieChart.update();
            }
        }

        self.selectTopFiveBiggestUsers = function () {
            let selectUsers = [];
            if (Object.keys(self.usersUsageData).length > 0) {
                const mostRecentDateString = Object.keys(self.usersUsageData).reduce((acc, cur) => new Date(acc) > new Date(cur) ? acc : cur );
                let users = Object.entries(self.usersUsageData[mostRecentDateString]);
                users.sort((a, b) => (b[1].datasets + b[1].submissions) - (a[1].datasets + a[1].submissions));
                selectUsers = users.slice(0, 5).map(([id]) => id);
            }
            for(const userId of selectUsers) {
                $(self.refs.users_dropdown).dropdown('set selected', userId);
            }
        }

        self.updateUsersChart = function() {
            if(Object.keys(self.usersUsageData).length > 0) {
                const selectedUsers = Object.fromEntries(
                    Object.entries(self.usersUsageData).map(([dateString, users]) => [
                        dateString,
                        Object.fromEntries(
                            Object.entries(users).filter(([userId]) => self.selectedUsers.includes(userId))
                        )
                    ])
                );

                const usersUsage = {};
                for (let [dateString, users] of Object.entries(selectedUsers)) {
                    for (let [userId, user] of Object.entries(users)) {
                        if (!usersUsage.hasOwnProperty(userId)) {
                            usersUsage[userId] = [];
                        }
                        usersUsage[userId].push({x: new Date(dateString), y: user.datasets * 1024});
                    }
                }

                self.storageUsersUsageChart.data.datasets = [];
                let index = 0;
                for(let [userId, dataset] of Object.entries(usersUsage)) {
                    const color = self.colors[index % self.colors.length];
                    const name = Object.values(self.usersUsageData)[0][userId].name;
                    self.storageUsersUsageChart.data.datasets.push({
                        userId: userId,
                        label: name,
                        data: dataset,
                        backgroundColor: color,
                        borderWidth: 1,
                        lineTension: 0,
                        fill: false
                    });
                    index++;
                }

                self.storageUsersUsageChart.update();
            }
        }

        self.updateUsersPieChart = function() {
            let selectedDate = self.usersTableSelectedDate;
            if (!selectedDate) {
                selectedDate = new Date(Object.keys(self.usersUsageData).reduce((acc, cur) => new Date(acc) > new Date(cur) ? acc : cur , '0000-00-00'));
            }
            const selectedDateString = selectedDate.getUTCFullYear() + "-" + (selectedDate.getUTCMonth()+1) + "-" + selectedDate.getUTCDate();
            const closestOlderDateString = Object.keys(self.usersUsageData).reduce((acc, cur) => (Math.abs(new Date(selectedDateString) - new Date(cur)) < Math.abs(new Date(selectedDateString) - new Date(acc)) && (new Date(selectedDateString) - new Date(cur) >= 0)) ? cur : acc, '9999-12-31');
            const usersAtSelectedDate = self.usersUsageData[closestOlderDateString];
            const selectedUsers = Object.keys(usersAtSelectedDate).filter(date => self.selectedUsers.includes(date)).reduce((user, date) => ({ ...user, [date]: usersAtSelectedDate[date] }), {});

            const {labels, usersId, data} = self.formatDataForUsersPieChart(selectedUsers);
            self.storageUsersUsagePieChart.data.labels = labels;
            self.storageUsersUsagePieChart.data.usersId = usersId;
            self.storageUsersUsagePieChart.data.datasets[0].data = data;
            self.storageUsersUsagePieChart.data.datasets[0].labels = labels;
            self.storageUsersUsagePieChart.data.datasets[0].backgroundColor = self.listOfColors(data.length);
            self.storageUsersUsagePieChart.update();
        }

        self.updateUsersTable = function() {
            const data = self.usersUsageData;
            let usersUsageTableData = [];
            if (Object.keys(data).length > 0) {
                let selectedDate = self.usersTableSelectedDate;
                if (!selectedDate) {
                    selectedDate = new Date(Object.keys(data).reduce((acc, cur) => new Date(acc) > new Date(cur) ? acc : cur , '0000-00-00'));
                }
                const selectedDateString = selectedDate.getUTCFullYear() + "-" + (selectedDate.getUTCMonth()+1) + "-" + selectedDate.getUTCDate();
                const closestOlderDateString = Object.keys(data).reduce((acc, cur) => (Math.abs(new Date(selectedDateString) - new Date(cur)) < Math.abs(new Date(selectedDateString) - new Date(acc)) && (new Date(selectedDateString) - new Date(cur) >= 0)) ? cur : acc, '9999-12-31');
                const users = data[closestOlderDateString];
                Object.entries(users).forEach(keyValue => {
                    const [userId, user] = keyValue;
                    usersUsageTableData.push({
                        'id': userId,
                        'name': user.name,
                        'date_joined': new Date(user.date_joined),
                        'datasets': user.datasets * 1024,
                        'submissions': user.submissions * 1024
                    });
                });
                self.update({usersUsageTableData: usersUsageTableData});
            }
        }

        self.onStorageUsersUsagePieChartClick = function(event, activeElements) {
            if (activeElements.length > 0) {
                const userId = self.storageUsersUsagePieChart.data.usersId[activeElements[0]._index];
                if (self.selectedUserId != userId) {
                    const data = self.usersUsageData;
                    let selectedDate = self.usersTableSelectedDate;
                    if (!selectedDate) {
                        selectedDate = new Date(Object.keys(data).reduce((acc, cur) => new Date(acc) > new Date(cur) ? acc : cur , '0000-00-00'));
                    }
                    const selectedDateString = selectedDate.getUTCFullYear() + "-" + (selectedDate.getUTCMonth()+1) + "-" + selectedDate.getUTCDate();
                    const closestOlderDateString = Object.keys(data).reduce((acc, cur) => (Math.abs(new Date(selectedDateString) - new Date(cur)) < Math.abs(new Date(selectedDateString) - new Date(acc)) && (new Date(selectedDateString) - new Date(cur) >= 0)) ? cur : acc, '9999-12-31');
                    const users = data[closestOlderDateString];
                    const userData = users[userId];
                    const datasets_data = [
                        userData.datasets * 1024,
                        userData.submissions * 1024,
                    ];
                    const labels = [
                        "datasets",
                        "submissions"
                    ];
                    self.storageUsersUsageDetailedPieChart.data.labels = labels;
                    self.storageUsersUsageDetailedPieChart.data.datasets[0].data = datasets_data;
                    self.storageUsersUsageDetailedPieChart.data.datasets[0].labels = labels;
                    self.storageUsersUsageDetailedPieChart.data.datasets[0].backgroundColor = ["#36a2eb", "#ff6384"];
                    self.storageUsersUsageDetailedPieChart.options.title = {display: true, text: userData.name};
                    self.selectedUserId = userId;
                    self.storageUsersUsageDetailedPieChart.update();
                }
            }
        }

        self.formatDate = function(date) {
            return datetime.fromJSDate(date).toISODate();
        }

        self.downloadUsersHistory = function() {
            var csv = [];

            const users = Object.values(self.usersUsageData)[0];
            const users_id = Object.entries(users).map(([id, { name }]) => (id));
            const users_name = Object.entries(users).map(([id, { name }]) => (name));
            csv.push("," + users_id.join(","));
            csv.push("," + users_name.join(","));

            sorted_dates = Object.keys(self.usersUsageData).sort(function(a, b) {return new Date(a) - new Date(b)});
            for (const date of sorted_dates) {
                let points = [date];
                for (const id of users_id) {
                    points.push((self.usersUsageData[date][id]['datasets'] + self.usersUsageData[date][id]['submissions']) * 1024);
                }
                csv.push(points.join(","));
            }

            const blob = new Blob([csv.join('\n')], { type: 'text/csv;charset=utf-8;' });
            saveAs(blob, "users_usage_history.csv");
        }

        self.downloadUsersTable = function() {
            var csv = [];

            let categories = ['User', 'Joined at', 'Datasets', 'Submissions', 'Total'];
            csv.push(categories.join(","));

            for (const user of self.usersUsageTableData) {
                const points = [
                    user.name,
                    user.date_joined.toLocaleString(),
                    user.datasets * 1024,
                    user.submissions * 1024,
                    (user.datasets + user.submissions) * 1024
                ];
                csv.push(points.join(","));
            }

            const blob = new Blob([csv.join('\n')], { type: 'text/csv;charset=utf-8;' });
            saveAs(blob, "users_table.csv");
        }
});
riot.tag2('analytics', '<h1>Analytics</h1> <div class="ui top no-segment bluewood inverted two column item menu analytics"> <a class="active item" data-tab="overview">Overview</a> <a class="item" data-tab="storage">Storage</a> </div> <div class="ui grid"> <div class="four wide column"> <h3>Date Range</h3> <div class="ui selection dropdown" ref="date_shortcut_dropdown"> <input type="hidden" name="range_shortcut" value="month"> <i class="dropdown icon"></i> <div class="text">This Month</div> <div class="menu"> <div class="item" data-value="year">This Year</div> <div class="item" data-value="month">This Month</div> <div class="item" data-value="week">This Week</div> <div class="item" data-value="custom">Custom</div> </div> </div> </div> <div class="four wide column"> <h3>Chart Resolution</h3> <div class="ui selection dropdown" ref="chart_resolution_dropdown"> <input type="hidden" name="resolution"> <i class="dropdown icon"></i> <div class="default text">Month</div> <div class="menu"> <div class="item" data-value="month">Month</div> <div class="item" data-value="week">Week</div> <div class="item" data-value="day">Day</div> </div> </div> </div> <div class=" hidden four wide column" ref="start_date_selection_container"> <h3>Start Date</h3> <div class="ui calendar" ref="start_calendar"> <div class="ui input left icon"> <i class="calendar icon"></i> <input type="text" placeholder="{start_date_string}"> </div> </div> </div> <div class="hidden four wide column" ref="end_date_selection_container"> <h3>End Date</h3> <div class="ui calendar" ref="end_calendar"> <div class="ui input left icon"> <i class="calendar icon"></i> <input type="text" placeholder="{end_date_string}"> </div> </div> </div> </div> <div class="ui active tab segment" data-tab="overview"> <div class="ui top attached tabular menu"> <a class="active item" data-tab="competitions">Benchmarks</a> <a class="item" data-tab="submissions">Submissions</a> <a class="item" data-tab="users">Users</a> </div> <div class="ui bottom attached active tab segment" data-tab="competitions"> <div class="ui small statistic"> <div class="value"> {competitions} </div> <div class="label"> Benchmarks Created </div> </div> <div class="ui small statistic"> <div class="value"> {competitions_published} </div> <div class="label"> Benchmarks Published </div> </div> <div class="chart-container"> <canvas class="big" ref="competition_chart"></canvas> </div> </div> <div class="ui bottom attached tab segment" data-tab="submissions"> <div class="ui small statistic"> <div class="value"> {submissions_made} </div> <div class="label"> Submissions Made </div> </div> <div class="chart-container"> <canvas class="big" ref="submission_chart"></canvas> </div> </div> <div class="ui bottom attached tab segment" data-tab="users"> <div class="ui small statistic"> <div class="value"> {users_total} </div> <div class="label"> Users Joined </div> </div> <div class="chart-container"> <canvas class="big" ref="user_chart"></canvas> </div> </div> <a class="ui green button" href="{URLS.ANALYTICS_API({start_date: start_date_string, end_date: end_date_string, time_unit: time_unit, format: \'csv\'})}" download="codalab_analytics.csv"> <i class="icon download"></i>Download as CSV </a> </div> <div class="ui tab segment storage" data-tab="storage"> <div class="ui top attached tabular menu"> <a class="item" data-tab="usage-history">Usage history</a> <a class="item" data-tab="competitions-usage">Competitions usage</a> <a class="item" data-tab="users-usage">Users usage</a> <div class="delete-oprhans-container"> <button class="ui red button {disabled: delete_orphans_button_modal_disabled}" onclick="{showConfirmationModal}"> <i class="icon {warning: !delete_orphans_button_modal_loading}"></i> {delete_orphans_button_modal_text} </button> </div> </div> <div class="ui bottom attached tab segment" data-tab="usage-history"> <analytics-storage-usage-history start_date="{start_date_string}" end_date="{end_date_string}" resolution="{time_unit}" is_visible="{current_view==⁗usage-history⁗}"></analytics-storage-usage-history> </div> <div class="ui bottom attached tab segment" data-tab="competitions-usage"> <analytics-storage-competitions-usage start_date="{start_date_string}" end_date="{end_date_string}" resolution="{time_unit}" is_visible="{current_view==⁗competitions-usage⁗}"></analytics-storage-competitions-usage> </div> <div class="ui bottom attached tab segment" data-tab="users-usage"> <analytics-storage-users-usage start_date="{start_date_string}" end_date="{end_date_string}" resolution="{time_unit}" is_visible="{current_view==⁗users-usage⁗}"></analytics-storage-users-usage> </div> <div ref="confirmation_modal" class="ui small modal"> <div class="header"> Delete orphan files </div> <div class="content"> <h4>You are about to delete {nb_orphan_files} orphan files.</h4> <h5><i>Note: The number of orphan files displayed is based on the most recent storage inconsistency analytics. Its value will be updated during the next storage analytics task.</i></h5> <h3>This operation is irreversible!</h3> <h3>Do you want to proceed ?</h3> </div> <div class="actions"> <button class="ui icon button {delete_button_color} {disabled: delete_button_disabled}" onclick="{deleteOrphanFiles}"> <i if="{delete_button_color==⁗green⁗}" class="check icon"></i> {delete_button_text} </button> <button class="ui cancel button">Close</button> </div> </div> </div>', 'analytics { width: 100%; } analytics .ui.inverted.bluewood.menu,[data-is="analytics"] .ui.inverted.bluewood.menu{ background-color: #2c3f4c; } analytics h1,[data-is="analytics"] h1{ margin-bottom: 20px; margin-top: 30px; } analytics h3,[data-is="analytics"] h3{ margin-bottom: 8px; } analytics canvas.big,[data-is="analytics"] canvas.big{ height: 500px !important; width: 1000px !important; } analytics .hidden,[data-is="analytics"] .hidden{ display: none !important; } analytics .date-input,[data-is="analytics"] .date-input{ display: flex; flex-direction: column; } analytics .start-date-input,[data-is="analytics"] .start-date-input{ margin-right: 40px; } analytics .date-selection,[data-is="analytics"] .date-selection{ display: flex; justify-content: space-between; flex-direction: row; background: #eee; margin-top: 30px; border-radius: 4px; padding: 10px; width: fit-content; } analytics .chart-container,[data-is="analytics"] .chart-container{ min-height: 450px; } analytics .delete-oprhans-container,[data-is="analytics"] .delete-oprhans-container{ margin-bottom: 5px; margin-left: auto; }', '', function(opts) {
        var self = this

        self.current_view = "overview";
        self.currentAnalyticsTab = "overview";
        self.currentStorageTab = "usageHistory";
        self.isDataReloadNeeded = {
            "overview": true,
            "storage": {
                "usageHistory": true,
                "competitionsUsage": true,
                "usersUsage": true,
            }
        };

        self.time_unit = 'month';
        let datetime = luxon.DateTime;
        self.start_date = datetime.local(datetime.local().year);
        self.end_date = datetime.local();
        self.start_date_string = self.start_date.toISODate();
        self.end_date_string = self.end_date.toISODate();

        self.colors = ["#36a2eb", "#ff6384", "#4bc0c0", "#ff9f40", "#9966ff", "#ffcd56", "#c9cbcf"];

        self.competitionsChart;
        self.submissionsChart;
        self.usersChart;

        self.competitions_data;
        self.submissions_data;
        self.users_data;

        self.nb_orphan_files = 0
        self.delete_button_color = "red"
        self.delete_button_loading = false
        self.delete_button_disabled = false
        self.delete_button_text = "Yes, delete all orphan files"

        self.delete_orphans_button_modal_text = "Delete orphan files"
        self.delete_orphans_button_modal_loading = false
        self.delete_orphans_button_modal_disabled = false
        self.pollingInterval;

        self.one("mount", function () {

            $('.tabular.menu .item', self.root).tab();
            $('.no-segment.menu .item', self.root).tab();

            self.shortcut_dropdown = $(self.refs.date_shortcut_dropdown);
            self.resolution_dropdown = $(self.refs.chart_resolution_dropdown);
            self.shortcut_dropdown.dropdown({
                onChange: function(value, text, item) {
                    if (value === 'custom') {
                        $(self.refs.start_date_selection_container).removeClass('hidden')
                        $(self.refs.end_date_selection_container).removeClass('hidden')
                    } else {
                        $(self.refs.start_date_selection_container).addClass('hidden')
                        $(self.refs.end_date_selection_container).addClass('hidden')
                        self.time_range_shortcut(value)
                    }
                }
            });
            self.resolution_dropdown.dropdown({
                onChange: function(value, text, item) {
                    self.update_chart_resolution(value)
                }
            });

            let general_calendar_options = {
                type: 'date',

                formatter: {
                   date: function (date, settings) {
                       return datetime.fromJSDate(date).toISODate();
                   }
                },
            };

            let start_specific_options = {
                endCalendar: $(self.refs.end_calendar),
                onChange: function(date, text) {
                    self.start_date = datetime.fromJSDate(date)
                    self.start_date_string = self.start_date.toISODate();
                    self.update({start_date_string: self.start_date_string});
                    let end_date = $(self.refs.end_calendar).calendar('get date')

                    if (!!end_date && date > end_date) {
                        $(self.refs.end_calendar).calendar('set date', date, true, true);
                        toastr.error("Start date must be before end date.");
                    } else {
                        self.isDataReloadNeeded["overview"] = true;
                        Object.keys(self.isDataReloadNeeded["storage"]).forEach(v => self.isDataReloadNeeded["storage"][v] = true);
                        if (self.currentAnalyticsTab == "overview") {
                            self.update_analytics(self.start_date, self.end_date, self.time_unit);
                        }
                    }
                }
            };

            let end_specific_options = {
                startCalendar: $(self.refs.start_calendar),
                onChange: function(date, text) {
                    if (date) {
                        self.end_date = datetime.fromJSDate(date)
                        self.end_date_string = self.end_date.toISODate();
                        self.update({end_date_string: self.end_date_string});
                    }

                    self.isDataReloadNeeded["overview"] = true;
                    Object.keys(self.isDataReloadNeeded["storage"]).forEach(v => self.isDataReloadNeeded["storage"][v] = true);
                    if (self.currentAnalyticsTab == "overview") {
                        self.update_analytics(self.start_date, self.end_date, self.time_unit);
                    }
                },
            }

            let start_calendar_options = _.assign({}, general_calendar_options, start_specific_options)
            let end_calendar_options = _.assign({}, general_calendar_options, end_specific_options)

            $(self.refs.start_calendar).calendar(start_calendar_options);
            $(self.refs.end_calendar).calendar(end_calendar_options);

            self.competitionsChart = new Chart($(self.refs.competition_chart), create_chart_config('# of Competitions'));
            self.submissionsChart = new Chart($(self.refs.submission_chart), create_chart_config('# of Submissions'));
            self.usersChart = new Chart($(self.refs.user_chart), create_chart_config('# of Users Joined'));

            $('.top.menu.analytics .item').tab({'onVisible': this.onAnalyticsTabChange});
            $('.storage .top.menu .item').tab({'onVisible': this.onStorageTabChange});

            $('.top.menu.analytics .item').tab('change tab', 'overview');
            $('.storage .top.menu .item').tab('change tab', 'usage-history');

            self.update_analytics(self.start_date, null, self.time_unit);
            self.time_range_shortcut("month");
            self.update_chart_resolution("day");
            self.getOrphanFiles();
            self.startCheckOrphansDeletionStatus();
        })

        function create_chart_config(label) {
            return {
                type: 'line',
                data: {
                    datasets: [{
                        label: label,
                        data: null,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor:'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                        lineTension: 0,
                    }],
                },
                options: {
                    scales: {
                        xAxes: [{
                            type: 'time',
                            time: {
                                unit: 'month'
                            }
                        }],
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                stepSize: 1,
                            }
                        }]
                    }
                }
            }
        }

        function build_chart_data(data, day_resolution, csv_format) {
            let chart_data = _.map(data, data_point => {
                let d = new Date(data_point._datefield)
                d.setDate(d.getDate() + 1)

                return {
                    x: d,
                    y: data_point.count,
                }
            })

            chart_data.sort(function(a,b) {
                return a.x - b.x
            })

            return chart_data
         }

        function update_chart(chart, data, day_resolution) {
            chart.data.datasets[0].data = build_chart_data(data, day_resolution, false)
            chart.update()
        }

        self.update_analytics = function (start, end, time_unit) {
            if (!end) {
                end = datetime.local()
            }

            let date_parameters = {
                start_date: start.toISODate(),
                end_date: end.plus({day: 1}).toISODate(),
                time_unit: time_unit,
            }

            CODALAB.api.get_analytics(date_parameters)
                .done(function (data) {
                    let time_unit = data.time_unit === 'day'

                    update_chart(self.competitionsChart, data.competitions_data, time_unit)
                    update_chart(self.submissionsChart, data.submissions_data, time_unit)
                    update_chart(self.usersChart, data.users_data, time_unit)

                    self.competitions_data = data.competitions_data
                    self.submissions_data = data.submissions_data
                    self.users_data = data.users_data

                    self.update({
                        users_total: data.registered_user_count,
                        competitions: data.competition_count,
                        competitions_published: data.competitions_published_count,
                        start_date_string: data.start_date,
                        end_date_string: data.end_date,
                        submissions_made: data.submissions_made_count,
                    });

                    self.isDataReloadNeeded["overview"] = false;
                })
                .fail(function (a, b, c) {
                    toastr.error("Could not load analytics data...")
                })
        }

        self.onAnalyticsTabChange = function (tabName) {
            self.currentAnalyticsTab = tabName;
            if (tabName == "overview") {
                self.current_view = self.currentAnalyticsTab;
                self.update({current_view: self.currentAnalyticsTab});
            } else if (tabName == "storage") {
                self.current_view = self.currentStorageTab;
                self.update({current_view: self.currentStorageTab});
            }

            if (tabName == "overview" && self.isDataReloadNeeded["overview"]) {
                self.update_analytics(self.start_date, self.end_date, self.time_unit);
            }
        };

        self.onStorageTabChange = function(tabName) {
            self.currentStorageTab = tabName;
            if (self.current_view != "overview") {
                self.current_view = self.currentStorageTab;
                self.update({current_view: self.currentStorageTab});
            }
        }

        self.time_range_shortcut = function(unit_selection) {
            self.end_date = datetime.local();

            let diffs = {
                month: {months: 1},
                week: {days: 6},
                year: {years: 1},
            }

            self.start_date = self.end_date.minus(diffs[unit_selection]);
            self.shortcut_dropdown.dropdown('set selected', unit_selection);
            self.time_unit = 'day';

            self.start_date_string = self.start_date.toISODate();
            self.end_date_string = self.end_date.toISODate();

            if (unit_selection !== 'year') {
                self.resolution_dropdown.dropdown('set selected', 'day');
            } else {
                self.time_unit = 'month';
                self.resolution_dropdown.dropdown('set selected', 'month');
            }

            self.update({start_date_string: self.start_date_string, end_date_string: self.end_date_string, time_unit: self.time_unit});

            self.isDataReloadNeeded["overview"] = true;
            Object.keys(self.isDataReloadNeeded["storage"]).forEach(v => self.isDataReloadNeeded["storage"][v] = true);

            if (self.currentAnalyticsTab == "overview") {
                self.update_analytics(self.start_date, self.end_date, self.time_unit);
            }
        }

        self.update_chart_resolution = function(unit_selection) {
            self.time_unit = unit_selection;
            self.update({time_unit: self.time_unit});
            self.resolution_dropdown.dropdown('set selected', unit_selection);

            self.competitionsChart.options.scales.xAxes[0].time.unit = unit_selection;
            self.submissionsChart.options.scales.xAxes[0].time.unit = unit_selection;
            self.usersChart.options.scales.xAxes[0].time.unit = unit_selection;
            self.competitionsChart.update();
            self.submissionsChart.update();
            self.usersChart.update();

            self.isDataReloadNeeded["overview"] = true;
            Object.keys(self.isDataReloadNeeded["storage"]).forEach(v => self.isDataReloadNeeded["storage"][v] = true);

            if (self.currentAnalyticsTab == "overview") {
                self.update_analytics(self.start_date, self.end_date, self.time_unit);
            }
            self.update();
        }

        self.pretty_date = function (date_string) {
            if (!!date_string) {
                return luxon.DateTime.fromISO(date_string).toLocaleString(luxon.DateTime.DATE_FULL)
            } else {
                return ''
            }
        }

        self.showConfirmationModal = function() {
            $(self.refs.confirmation_modal).modal('show');
            self.delete_button_color = "red";
            self.delete_button_loading = false;
            self.delete_button_disabled = false;
            self.delete_button_text = "Yes, delete all orphan files";
            self.update();
        }

        self.checkOrphansDeletionStatus = function() {
            CODALAB.api.check_orphans_deletion_status()
                .done(function(data) {
                    if (data.status) {
                        if (data.status == "SUCCESS") {
                            toastr.success("Orphan files deletion successful")
                            self.delete_button_color = "green";
                            self.delete_button_text = "Deletion Successful";
                        }
                        if (data.status == "FAILURE") {
                            toastr.error("Orphan files deletion failed")
                            self.delete_button_color = "red";
                            self.delete_button_text = "Deletion Failed";
                        }
                        if (data.status == "REVOKED") {
                            toastr.error("Orphan files deletion has been canceled")
                            self.delete_button_color = "red";
                            self.delete_button_text = "Deletion canceled";
                        }
                        if (data.status == "SUCCESS" || data.status == "FAILURE" || data.status == "REVOKED") {

                            self.stopCheckOrphansDeletionStatus();
                            self.delete_orphans_button_modal_text = "Delete orphan files";
                            self.delete_orphans_button_modal_loading = false;
                            self.delete_orphans_button_modal_disabled = false;
                            self.delete_button_loading = false;
                            self.delete_button_disabled = true;
                        } else {

                            self.delete_orphans_button_modal_text = "Orphan files deletion in progress...";
                            self.delete_orphans_button_modal_disabled = true;
                            self.delete_orphans_button_modal_loading = true;

                            self.delete_button_text = "Orphan files deletion in progress...";
                            self.delete_button_disabled = true;
                            self.delete_button_loading = true;
                        }
                    } else {

                        self.stopCheckOrphansDeletionStatus();

                        self.delete_orphans_button_modal_text = "Delete orphan files";
                        self.delete_orphans_button_modal_disabled = false;
                        self.delete_orphans_button_modal_loading = false;

                        self.delete_button_color = "red";
                        self.delete_button_loading = false;
                        self.delete_button_disabled = false;
                        self.delete_button_text = "Yes, delete all orphan files";
                    }

                })
                .fail(function(response) {
                    toastr.error("Orphan files deletion's task status check failed")
                    self.delete_orphans_button_modal_text = "Delete orphan files";
                    self.delete_orphans_button_modal_loading = false;
                    self.delete_orphans_button_modal_disabled = false;

                    self.delete_button_text = "Yes, delete all orphan files";
                    self.delete_button_color = "red";
                    self.delete_button_loading = false;
                    self.delete_button_disabled = false;

                    self.stopCheckOrphansDeletionStatus();
                })
                .always(function() {
                    self.update();
                })
        }

        self.startCheckOrphansDeletionStatus = function () {
            self.pollingInterval = setInterval(self.checkOrphansDeletionStatus, 2000);
        }

        self.stopCheckOrphansDeletionStatus = function() {
            if (self.pollingInterval) {
                clearInterval(self.pollingInterval);
                self.pollingInterval = null;
            }
        }

        self.deleteOrphanFiles = function() {
            self.delete_button_loading = true
            self.delete_button_disabled = true
            self.delete_orphans_button_modal_loading = true;
            self.delete_orphans_button_modal_disabled = true;
            self.delete_button_text = "Orphan files deletion in progress...";
            self.delete_orphans_button_modal_text = "Orphan files deletion in progress...";
            self.update()
            CODALAB.api.delete_orphan_files()
                .done(function (data) {
                    if (data && data.success && !self.pollingInterval) {
                        self.startCheckOrphansDeletionStatus();
                    }
                })
                .fail(function (response) {
                    toastr.error("Orphan files deletion failed to start")
                })
                .always(function () {
                    self.delete_button_loading = false
                    self.update()
                });
        }

        self.getOrphanFiles = function() {
            CODALAB.api.get_orphan_files()
                .done(function (data) {
                    self.nb_orphan_files = data.data.length
                    self.update({nb_orphan_files: self.nb_orphan_files});
                })
                .fail(function (response) {
                    toastr.error("Get oprhan files failed, error occurred")
                });
        }

});

riot.tag2('bundle-management', '<div class="ui icon input"> <input type="text" placeholder="Search..." ref="search" onkeyup="{filter.bind(this, undefined)}"> <i class="search icon"></i> </div> <button class="ui red right floated labeled icon button {disabled: marked_datasets.length === 0}" onclick="{delete_datasets}"> <i class="icon delete"></i> Delete Selected </button> <table id="bundlesTable" class="ui {selectable: datasets.length > 0} celled compact sortable table"> <thead> <tr> <th>File Name</th> <th>Benchmark</th> <th width="175px">Size</th> <th width="125px">Uploaded</th> <th width="50px" class="no-sort">Delete?</th> <th width="25px" class="no-sort"></th> </tr> </thead> <tbody> <tr each="{dataset, index in datasets}" class="dataset-row" onclick="{show_info_modal.bind(this, dataset)}"> <td>{dataset.name}</td> <td> <div if="{dataset.competition}" class="ui fitted"> <a id="competitionLink" href="{URLS.COMPETITION_DETAIL(dataset.competition.id)}" target="_blank">{dataset.competition.title}</a> </div> </td> <td>{pretty_bytes(dataset.file_size)}</td> <td>{timeSince(Date.parse(dataset.created_when))} ago</td> <td class="center aligned"> <button show="{dataset.created_by === CODALAB.state.user.username}" class="ui mini button red icon" onclick="{delete_dataset.bind(this, dataset)}"> <i class="icon delete"></i> </button> </td> <td class="center aligned"> <div show="{dataset.created_by === CODALAB.state.user.username}" class="ui fitted checkbox"> <input type="checkbox" name="delete_checkbox" onclick="{mark_dataset_for_deletion.bind(this, dataset)}"> <label></label> </div> </td> </tr> <tr if="{datasets.length === 0}"> <td class="center aligned" colspan="6"> <em>No Datasets Yet!</em> </td> </tr> </tbody> <tfoot> <tr> <th colspan="8" if="{datasets.length > 0}"> <div class="ui right floated pagination menu" if="{datasets.length > 0}"> <a show="{!!_.get(pagination, \'previous\')}" class="icon item" onclick="{previous_page}"> <i class="left chevron icon"></i> </a> <div class="item"> <label>{page}</label> </div> <a show="{!!_.get(pagination, \'next\')}" class="icon item" onclick="{next_page}"> <i class="right chevron icon"></i> </a> </div> </th> </tr> </tfoot> </table> <div ref="info_modal" class="ui modal"> <div class="header"> {selected_row.name} </div> <div class="content"> <h3>Details</h3> <table class="ui basic table"> <thead> <tr> <th>Key</th> <th>Created By</th> <th>Created</th> </tr> </thead> <tbody> <tr> <td>{selected_row.key}</td> <td><a href="/profiles/user/{selected_row.created_by}/" target="_blank">{selected_row.owner_display_name}</a></td> <td>{pretty_date(selected_row.created_when)}</td> </tr> </tbody> </table> <virtual if="{!!selected_row.description}"> <div>Description:</div> <div class="ui segment"> {selected_row.description} </div> </virtual> <div show="{!!_.get(selected_row.in_use, \'length\')}"><strong>Used by:</strong> <div class="ui bulleted list"> <div class="item" each="{comp in selected_row.in_use}"> <a href="{URLS.COMPETITION_DETAIL(comp.pk)}" target="_blank">{comp.title}</a> </div> </div> </div> </div> <div class="actions"> <a href="{URLS.DATASET_DOWNLOAD(selected_row.key)}" class="ui green icon button"> <i class="download icon"></i>Download File </a> <button class="ui cancel button">Close</button> </div> </div>', '', '', function(opts) {
        var self = this

        self.datasets = []
        self.marked_datasets = []
        self.selected_row = {}
        self.page = 1

        self.one("mount", function () {
            $(".ui.dropdown", self.root).dropdown()
            $(".ui.checkbox", self.root).checkbox()
            $('#bundlesTable').tablesort()
            self.update_datasets()
        })

        self.pretty_date = date => luxon.DateTime.fromISO(date).toLocaleString(luxon.DateTime.DATE_FULL)

        self.filter = function (filters) {
            filters = filters || {}
            _.defaults(filters, {
                search: $(self.refs.search).val(),
                page: 1,
            })
            self.page = filters.page
            self.update_datasets(filters)
        }

        self.next_page = function () {
            if (!!self.pagination.next) {
                self.page += 1
                self.filter({page: self.page})
            } else {
                alert("No valid page to go to!")
            }
        }

        self.previous_page = function () {
            if (!!self.pagination.previous) {
                self.page -= 1
                self.filter({page: self.page})
            } else {
                alert("No valid page to go to!")
            }
        }

        self.update_datasets = function (filters) {
            filters = filters || {}
            filters._type = "bundle"
            CODALAB.api.get_datasets(filters)
                .done(function (data) {
                    self.datasets = data.results
                    self.pagination = {
                        "count": data.count,
                        "next": data.next,
                        "previous": data.previous
                    }
                    self.update()
                })
                .fail(function (response) {
                    toastr.error("Could not load datasets...")
                })
        }

        self.delete_dataset = function (dataset, e) {
            if (confirm(`Are you sure you want to delete '${dataset.name}'?`)) {
                CODALAB.api.delete_dataset(dataset.id)
                    .done(function () {
                        self.update_datasets()
                        toastr.success("Dataset deleted successfully!")
                        CODALAB.events.trigger('reload_quota_cleanup')
                    })
                    .fail(function (response) {
                        toastr.error(response.responseJSON['error'])
                    })
            }
            event.stopPropagation()
        }

        self.delete_datasets = function () {
            if (confirm(`Are you sure you want to delete multiple datasets?`)) {
                CODALAB.api.delete_datasets(self.marked_datasets)
                    .done(function () {
                        self.update_datasets()
                        toastr.success("Dataset deleted successfully!")
                        self.marked_datasets = []
                        CODALAB.events.trigger('reload_quota_cleanup')
                    })
                    .fail(function (response) {
                        for (e in response.responseJSON) {
                            toastr.error(`${e}: '${response.responseJSON[e]}'`)
                        }
                    })
            }
            event.stopPropagation()
        }

        self.mark_dataset_for_deletion = function(dataset, e) {
            if (e.target.checked) {
                self.marked_datasets.push(dataset.id)
            }
            else {
                self.marked_datasets.splice(self.marked_datasets.indexOf(dataset.id), 1)
            }
        }

        self.show_info_modal = function (row, e) {

            if (e.target.type === 'checkbox' || e.target.id === 'competitionLink') {
                return
            }
            self.selected_row = row
            self.update()
            $(self.refs.info_modal).modal('show')
        }

});
riot.tag2('competition-list', '<div class="ui vertical stripe segment"> <div class="ui middle aligned stackable grid container centered"> <div class="row"> <div class="fourteen wide column"> <div class="ui fluid secondary pointing tabular menu"> <a class="active item" data-tab="running">Benchmarks I\'m Running</a> <a class="item" data-tab="participating">Benchmarks I\'m In</a> <div class="right menu"> <div class="item"> <help_button href="https://docs.codabench.org/latest/Organizers/Running_a_benchmark/Competition-Management-%26-List/"></help_button> </div> </div> </div> <div class="ui active tab" data-tab="running"> <table class="ui celled compact table participation"> <thead> <tr> <th>Name</th> <th width="100">Type</th> <th width="125">Uploaded...</th> <th width="50px">Publish</th> <th width="50px">Edit</th> <th width="50px">Delete</th> </tr> </thead> <tbody> <tr each="{competition in running_competitions}" no-reorder> <td><a href="{URLS.COMPETITION_DETAIL(competition.id)}">{competition.title}</a></td> <td class="center aligned">{competition.competition_type}</td> <td>{timeSince(Date.parse(competition.created_when))} ago</td> <td class="center aligned"> <button class="mini ui button published icon {grey: !competition.published, green: competition.published}" onclick="{toggle_competition_publish.bind(this, competition)}"> <i class="icon file"></i> </button> </td> <td class="center aligned"> <a href="{URLS.COMPETITION_EDIT(competition.id)}" class="mini ui button blue icon"> <i class="icon edit"></i> </a> </td> <td class="center aligned"> <button class="mini ui button red icon" onclick="{delete_competition.bind(this, competition)}"> <i class="icon delete"></i> </button> </td> </tr> </tbody> <tfoot> </tfoot> </table> </div> <div class="ui tab" data-tab="participating"> <table class="ui celled compact table"> <thead> <tr> <th>Name</th> <th width="125px">Uploaded...</th> </tr> </thead> <tbody> <tr each="{competition in participating_competitions}" style="height: 42px;"> <td><a href="{URLS.COMPETITION_DETAIL(competition.id)}">{competition.title}</a></td> <td>{timeSince(Date.parse(competition.created_when))} ago</td> </tr> </tbody> <tfoot> </tfoot> </table> </div> </div> </div> </div> </div>', 'competition-list .table.participation .published.icon.grey,[data-is="competition-list"] .table.participation .published.icon.grey{ opacity: 0.65; transition: 0.25s all ease-in-out; } competition-list .table.participation .published.icon.grey:hover,[data-is="competition-list"] .table.participation .published.icon.grey:hover{ background-color: #21ba45; }', '', function(opts) {
        var self = this

        self.one("mount", function () {
            self.update_competitions()
            $('.tabular.menu .item').tab();
        })

        self.update_competitions = function () {
            self.get_participating_in_competitions()
            self.get_running_competitions()
        }

        self.get_competitions_wrapper = function (query_params) {
            return CODALAB.api.get_competitions(query_params)
                .fail(function (response) {
                    toastr.error("Could not load competition list")
                })
        }

        self.get_participating_in_competitions = function () {
            self.get_competitions_wrapper({participating_in: true})
                .done(function (data) {
                    self.participating_competitions = data
                    self.update()
                })
        }

        self.get_running_competitions = function () {
            self.get_competitions_wrapper({
                mine: true,
                type: 'any',
            })
                .done(function (data) {
                    self.running_competitions = data
                    self.update()
                })
        }

        self.delete_competition = function (competition) {
            if (confirm("Are you sure you want to delete '" + competition.title + "'?")) {
                CODALAB.api.delete_competition(competition.id)
                    .done(function () {
                        self.update_competitions()
                        toastr.success("Competition deleted successfully")
                    })
                    .fail(function () {
                        toastr.error("Competition could not be deleted")
                    })
            }
        }

        self.toggle_competition_publish = function (competition) {
            CODALAB.api.toggle_competition_publish(competition.id)
                .done(function (data) {
                    var published_state = data.published ? "published" : "unpublished"
                    toastr.success(`Competition has been ${published_state} successfully`)
                    self.get_running_competitions()
                })
        }

});

riot.tag2('competition-detailed-results', '<iframe riot-src="{detailed_result}" width="100%" height="100%" frameborder="0"></iframe>', 'competition-detailed-results { width: 100%; }', '', function(opts) {

        let self = this
        CODALAB.api.get_submission_detail_result(opts.submission_id)
            .done((data) => {
                self.detailed_result = data
                self.update()
            })
            .fail((response) => {
                toastr.error(response.responseJSON.error_msg)
            })

});
riot.tag2('comp-detail-header', '<div class="ui relaxed grid"> <div class="row"> <div class="three wide column"> <img class="ui medium circular image competition-image" alt="Competition Logo" riot-src="{competition.logo}"> </div> <div class="ten wide column"> <div class="ui grid"> <div class="row"> <div class="column"> <div class="competition-name underline"> {competition.title} </div> </div> </div> <div class="row"> <div class="reward-container" if="{competition.reward}"> <img class="reward-icon" src="/static/img/trophy.png"> <div class="reward-text">{competition.reward}</div> </div> </div> <div if="{competition.admin}"> <a href="{URLS.COMPETITION_EDIT(competition.id)}" class="ui button">Edit</a> <button class="ui small button" onclick="{show_modal.bind(this, \'.manage-participants.modal\')}"> Participants </button> <button class="ui small button" onclick="{show_modal.bind(this, \'.manage-submissions.modal\')}"> Submissions </button> <button class="ui small button" onclick="{show_modal.bind(this, \'.manage-competition.modal\')}"> Dumps </button> <button class="ui small button" onclick="{show_modal.bind(this, \'.migration.modal\')}"> Migrate </button> </div> <div class="row"> <div class="column"> <div> <span class="detail-label">Organized by:</span> <span class="detail-item"><a href="/profiles/user/{competition.created_by}" target="_BLANK">{competition.owner_display_name}</a></span> <span if="{competition.contact_email}">(<span class="contact-email">{competition.contact_email}</span>)</span> </div> <div> <span class="detail-label">{has_current_phase(competition) ? \'Current Phase Ends\' : \'Current Active Phase\'}:</span> <span class="detail-item">{get_end_date(competition)}</span> </div> <div> <span class="detail-label">Current server time:</span> <span class="detail-item" id="server_time">{pretty_date(CURRENT_DATE_TIME)}</span> </div> <div class="competition-secret-key"> <span class="docker-label">Docker image:</span> <span id="docker-image">{competition.docker_image}</span> <span onclick="{copy_docker_url}" class="ui send-pop-docker" data-content="Copied!"> <i class="ui copy icon"></i> </span> </div> <div class="competition-secret-key" if="{competition.admin}"> <span class="secret-label">Secret url:</span> <span id="secret-url">https://{URLS.SECRET_KEY_URL(competition.id, competition.secret_key)}</span> <span onclick="{copy_secret_url}" class="ui send-pop-secret" data-content="Copied!"> <i class="ui copy icon"></i> </span> </div> <div class="competition-secret-key" if="{competition.report}"> <span class="report-label">Competition Report:</span> <span id="report-url">{competition.report}</span> <span onclick="{copy_report_url}" class="ui send-pop-report" data-content="Copied!"> <i class="ui copy icon"></i> </span> </div> </div> </div> </div> </div> <div class="three wide column"> <div class="stat-buttons"> <div class="ui tiny left labeled fluid button"> <a class="ui tiny basic red label">{competition.participants_count}</a> <div class="ui tiny red button">Participants</div> </div> <div class="ui tiny left labeled fluid button"> <a class="ui tiny basic teal label">{competition.submissions_count}</a> <div class="ui tiny teal button">Submissions</div> </div> </div> </div> </div> </div> <div class="ui manage-competition modal" ref="files_modal"> <div class="content"> <div class="ui dropdown button"> <i class="download icon"></i> <div class="text">Create Competition Dump</div> <div class="menu"> <div class="parent-modal item" onclick="{create_dump.bind(this, true)}"> Dump with keys </div> <div class="parent-modal item" onclick="{create_dump.bind(this, false)}"> Dump with files </div> </div> </div> <button class="ui icon button" onclick="{update_files}"> <i class="sync alternate icon"></i> Refresh Table </button> <table class="ui table"> <thead> <tr> <th>Files</th> </tr> </thead> <tbody> <tr show="{files.bundle}"> <td class="selectable"> <a href="{files.bundle ? files.bundle.url : \'\'}"> <i class="file archive outline icon"></i> Bundle: {files.bundle ? files.bundle.name : \'\'} </a> </td> </tr> <tr each="{file in files.dumps}" show="{files.dumps}"> <td class="selectable"> <a href="{file.url}"> <i class="file archive outline icon"></i> Dump: {file.name} </a> </td> </tr> <tr> <td show="{!files.dumps && !files.bundle}"> <em>No Files Yet</em> </td> </tr> <tr> <td class="center aligned" if="{tr_show}">Generating Dump, Please Refresh</td> </tr> </tbody> </table> </div> </div> <div class="ui manage-submissions large modal" ref="sub_modal"> <div class="content"> <submission-manager admin="{competition.admin}" competition="{competition}"></submission-manager> </div> </div> <div class="ui manage-participants modal" ref="participant_modal"> <div class="content"> <participant-manager></participant-manager> </div> </div> <div class="ui migration modal" ref="migration_modal"> <div class="content"> <table class="ui table"> <thead> <tr> <th colspan="100%"> Please Choose a phase to migrate </th> </tr> </thead> <tbody> <tr each="{phase, index in competition.phases}"> <td>{phase.name}</td> <td class="collapsing"> <button if="{index !== competition.phases.length - 1}" class="ui button" onclick="{migrate_phase.bind(this, phase.id)}"> Migrate </button> </td> </tr> </tbody> </table> </div> </div>', 'comp-detail-header .detail-label,[data-is="comp-detail-header"] .detail-label{ font-size: 1.25em; text-transform: uppercase; color: #0bb; font-family: \'Overpass Mono\', monospace; } comp-detail-header .detail-item,[data-is="comp-detail-header"] .detail-item{ font-size: 1.25em; color: #2c3f4c; text-transform: capitalize; font-family: \'Overpass Mono\', monospace; } comp-detail-header .competition-secret-key,[data-is="comp-detail-header"] .competition-secret-key{ font-size: 13px; } comp-detail-header .contact-email,[data-is="comp-detail-header"] .contact-email{ font-size: 1em; color: #0bb; font-family: \'Overpass Mono\', monospace; } comp-detail-header .secret-label,[data-is="comp-detail-header"] .secret-label{ color: #db2828; } comp-detail-header .docker-label,[data-is="comp-detail-header"] .docker-label{ color: #0bb; } comp-detail-header .report-label,[data-is="comp-detail-header"] .report-label{ color: #0bb; } comp-detail-header .secret-url,[data-is="comp-detail-header"] .secret-url{ color: #2c3f4c; } comp-detail-header .competition-name,[data-is="comp-detail-header"] .competition-name{ color: #2c3f4c; font-size: 3em; height: auto; line-height: 1.1em; text-transform: uppercase; font-weight: 800; } comp-detail-header .copy.icon,[data-is="comp-detail-header"] .copy.icon{ cursor: pointer; } comp-detail-header .competition-image,[data-is="comp-detail-header"] .competition-image{ box-shadow: 3px 3px 5px #a9a9a9; } comp-detail-header .underline,[data-is="comp-detail-header"] .underline{ border-bottom: 1px solid #0bb; display: inline-block; line-height: 0.9em; } comp-detail-header .tiny.left.labeled.button,[data-is="comp-detail-header"] .tiny.left.labeled.button{ display: flex; margin-top: 15px; justify-content: flex-end; } comp-detail-header .tiny.left.labeled.button .ui.tiny.button,[data-is="comp-detail-header"] .tiny.left.labeled.button .ui.tiny.button{ width: 120px; text-transform: uppercase; font-weight: 100; } comp-detail-header .ui.table,[data-is="comp-detail-header"] .ui.table{ color: #2c3f4c !important; } comp-detail-header .ui.table thead > tr > th,[data-is="comp-detail-header"] .ui.table thead > tr > th{ color: #2c3f4c !important; background-color: #f2faff !important; } comp-detail-header .reward-container,[data-is="comp-detail-header"] .reward-container{ background: linear-gradient(to right, #f96, #ff5e62); color: #fff; border: 1px solid #e6e9eb; border-radius: 5px; padding: 10px; display: flex; align-items: center; margin-left: 1rem; } comp-detail-header .reward-icon,[data-is="comp-detail-header"] .reward-icon{ width: 40px; height: 40px; margin-right: 10px; } comp-detail-header .reward-text,[data-is="comp-detail-header"] .reward-text{ font-size: 24px; font-weight: 900; display: inline-block; }', '', function(opts) {
        let self = this

        self.competition = {}
        self.files = []

        self.tr_show = false

        CODALAB.events.on('competition_loaded', function (competition) {
            competition.admin = CODALAB.state.user.has_competition_admin_privileges(competition)
            self.competition = competition
            self.update()
            if (self.competition.admin) {
                self.update_files()
            }
            $('.dropdown', self.root).dropdown()
        })

        self.close_modal = selector => $(selector).modal('hide')
        self.show_modal = selector => $(selector).modal('show')

        self.create_dump = (keys_instead_of_files) => {
            CODALAB.api.create_competition_dump(self.competition.id, keys_instead_of_files)
                .done(data => {
                    self.tr_show = true
                    toastr.success("Success! Your competition dump is being created.")
                    self.update()
                })
                .fail(response => {
                    toastr.error("Error trying to create competition dump.")
                })
        }

        self.update_files = (e) => {
            CODALAB.api.get_competition_files(self.competition.id)
                .done(data => {
                    self.files = data
                    self.tr_show = false
                    self.update()
                })
                .fail(response => {
                    toastr.error('Error Retrieving Competition Files')
                })
        }

        self.copy_secret_url = function () {
            let range = document.createRange();
            range.selectNode(document.getElementById("secret-url"));
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
            document.execCommand("copy");
            window.getSelection().removeAllRanges();
            $('.send-pop-secret').popup('toggle')
        }

        self.copy_docker_url = function () {
            let range = document.createRange();
            range.selectNode(document.getElementById("docker-image"));
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
            document.execCommand("copy");
            window.getSelection().removeAllRanges();
            $('.send-pop-docker').popup('toggle')
        }

        self.copy_report_url = function () {
            let range = document.createRange();
            range.selectNode(document.getElementById("report-url"));
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
            document.execCommand("copy");
            window.getSelection().removeAllRanges();
            $('.send-pop-report').popup('toggle')
        }

        self.has_current_phase = function (competition) {
            let current_phase = _.find(competition.phases, {status: 'Current'})
            return current_phase ? true : false
        }

        self.get_end_date = function (competition) {
            if(self.has_current_phase(competition)){
                let end_date = _.get(_.find(competition.phases, {status: 'Current'}), 'end')
                return end_date ? pretty_date(end_date) : 'Never'
            }else{
                return 'None'
            }

        }

        self.migrate_phase = function (phase_id) {
            CODALAB.api.manual_migration(phase_id)
                .done(data => {
                    toastr.success("Migration of this phase to the next should begin soon.")
                    self.close_modal(self.refs.migration_modal)
                })
                .fail(error => {
                    toastr.error('Something went wrong trying to migrate this phase.')
                })
        }

});

riot.tag2('registration', '<div if="{!status}"> <div class="ui yellow message"> <div class="row"> <div class="column"> <h3>You have not yet registered for this competition.</h3> <p> To participate in this competition, you must accept its specific <a href="" onclick="{show_modal}">terms and conditions</a>. <span if="{registration_auto_approve}">This competition <strong>does not</strong> require approval, once you register, you will immediately be able to participate.</span> </p> <p if="{!registration_auto_approve}"> This competition <strong>requires approval</strong> from the competition organizers. After submitting your registration request, an email will be sent to the competition organizers notifying them of your request. Your application will remain pending until they approve or deny it. </p> </div> </div> <virtual if="{CODALAB.state.user.logged_in}"> <div class="row"> <div class="ui checkbox"> <input type="checkbox" id="accept-terms" onclick="{accept_toggle}"> <label for="accept-terms">I accept the terms and conditions of the competition.</label> </div> </div> <div class="row"> <button class="ui primary button {disabled: !accepted}" onclick="{submit_registration}"> Register </button> </div> </virtual> <div class="row" if="{!CODALAB.state.user.logged_in}"> <div class="column"> <a href="{URLS.LOGIN}?next={location.pathname}">Log In</a> or <a href="{URLS.SIGNUP}" target="_blank">Sign Up</a> to register for this competition. </div> </div> </div> </div> <div if="{status}"> <div if="{status === \'pending\'}" class="ui yellow message"> <h3>Registration Status: {_.startCase(status)}</h3> Your request to participate in this competition is waiting for an approval from the competition organizer. </div> <div if="{status === \'denied\'}" class="ui red message"> <h3>Registration Status: {_.startCase(status)}</h3> Your request to participate in this competition is denied. Please contact the competition organizer for more details. </div> </div> <div ref="terms_modal" class="ui modal"> <div class="header"> Terms and Conditions </div> <div ref="terms_content" class="content"> </div> <div class="actions"> <div class="ui cancel button"> Close </div> </div> </div>', '', '', function(opts) {
        let self = this
        self.on('mount', () => {
            self.accepted = false
        })

        CODALAB.events.on('competition_loaded', (competition) => {
            self.competition_id = competition.id
            if (self.refs.terms_content) {
                const rendered_content = renderMarkdownWithLatex(competition.terms)
                self.refs.terms_content.innerHTML = ""
                rendered_content.forEach(node => {
                    self.refs.terms_content.appendChild(node.cloneNode(true));
                });
            }
            self.registration_auto_approve = competition.registration_auto_approve
            self.status = competition.participant_status
            self.update()
        })

        self.accept_toggle = () => {
            self.accepted = !self.accepted
        }

        self.show_modal = (e) => {
            if (e) {
                e.preventDefault()
            }
            $(self.refs.terms_modal).modal('show')
        }

        self.submit_registration = () => {

            const url = new URL(window.location.href)
            const searchParams = new URLSearchParams(url.search)
            const secretKey = searchParams.get('secret_key')

            CODALAB.api.submit_competition_registration(self.competition_id, secretKey)
                .done(response => {
                    self.status = response.participant_status
                    if (self.status === 'approved') {
                        toastr.success('You have been registered!')
                        CODALAB.api.get_competition(self.competition_id)
                            .done(competition => {
                                CODALAB.events.trigger('competition_loaded', competition)
                            })
                    } else {
                        toastr.success('Your registration application is being processed!')
                    }
                    self.update()
                })
                .fail(response => {
                    toastr.error('Error submitting your registration application.')
                })
        }
});
riot.tag2('comp-run-info', '<div class="comp-run-info"> <div class="comp-leaderboard"> <table class="ui tiny unstackable single line table"> <thead> <tr> <th>Rank</th> <th>Username</th> <th class="score">Score</th> </tr> </thead> <tbody> <tr> <td><img riot-src="{URLS.STATIC(\'img/gold_medal.svg\')}"></td> <td>Machine_Wizard</td> <td class="score">9001</td> </tr> <tr> <td><img riot-src="{URLS.STATIC(\'img/silver_medal.svg\')}"></td> <td>traincomps98</td> <td class="score">6500</td> </tr> <tr> <td><img riot-src="{URLS.STATIC(\'img/bronze_medal.svg\')}"></td> <td>digitaldynamo</td> <td class="score">5200</td> </tr> <tr> <td><img riot-src="{URLS.STATIC(\'img/4th_medal.svg\')}"></td> <td>nick_name</td> <td class="score">2250</td> </tr> <tr> <td><img riot-src="{URLS.STATIC(\'img/5th_medal.svg\')}"></td> <td>grade_a_learning</td> <td class="score">1375</td> </tr> </tbody> </table> </div> <div class="comp-submissions"> <table class="ui unstackable single line table"> <thead> <tr> <th>Public Submissions</th> </tr> </thead> <tbody> <tr> <td>John Lilki</td> </tr> <tr> <td>Jamie Harington</td> </tr> <tr> <td>Jill Lewis</td> </tr> <tr> <td>John Lilki</td> </tr> <tr> <td>Jamie Harington</td> </tr> </tbody> </table> </div> <div class="comp-comments"> <table class="ui unstackable single line table"> <thead> <tr> <th>Comment Feed</th> </tr> </thead> <tbody> <tr> <td>John Lilki</td> </tr> <tr> <td>Jamie Harington</td> </tr> <tr> <td>Jill Lewis</td> </tr> <tr> <td>John Lilki</td> </tr> <tr> <td>Jamie Harington</td> </tr> </tbody> </table> </div> </div>', 'comp-run-info .comp-run-info,[data-is="comp-run-info"] .comp-run-info{ width: inherit; display: grid; grid-template: "comp-leaderboard" "comp-submissions" "comp-comments"; grid-gap: 10px; } comp-run-info .comp-leaderboard,[data-is="comp-run-info"] .comp-leaderboard{ grid-template-areas: comp-leaderboard; height: 100%; } comp-run-info .comp-leaderboard table,[data-is="comp-run-info"] .comp-leaderboard table{ height: 100%; } comp-run-info .comp-leaderboard table td,[data-is="comp-run-info"] .comp-leaderboard table td{ font-size: 13px; } comp-run-info .comp-leaderboard table td img,[data-is="comp-run-info"] .comp-leaderboard table td img{ height: 24px; } comp-run-info .comp-leaderboard th.score,[data-is="comp-run-info"] .comp-leaderboard th.score,comp-run-info .comp-leaderboard td.score,[data-is="comp-run-info"] .comp-leaderboard td.score{ text-align: center; } comp-run-info .comp-submissions,[data-is="comp-run-info"] .comp-submissions{ grid-template-areas: comp-submissions; height: 100%; } comp-run-info .comp-submissions table,[data-is="comp-run-info"] .comp-submissions table{ height: 100%; } comp-run-info .comp-comments,[data-is="comp-run-info"] .comp-comments{ grid-template-areas: comp-comments; height: 100%; } comp-run-info .comp-comments table,[data-is="comp-run-info"] .comp-comments table{ height: 100%; } @media screen and (min-width: 700px) { comp-run-info .comp-run-info,[data-is="comp-run-info"] .comp-run-info{ grid-template-columns: 1fr 1fr 1fr; grid-template: "comp-leaderboard comp-submissions comp-comments"; } }', '', function(opts) {
        var self = this
        self.competition = {}
        CODALAB.events.on('competition_loaded', function(competition) {
            self.competition = competition
        })
});
riot.tag2('comp-stats', '<div class="ui container relaxed grid comp-stats"> <div class="middle aligned row"> <div class="four wide column"> <div class="ui forced-full-height"> <div class="ui compact menu"> <a class="item"> <i class="icon users"></i> Teams <div class="floating ui red label">10</div> </a> <a class="item"> <i class="icon user"></i> Participants <div class="floating ui teal label">63</div> </a> </div> </div> </div> <div class="twelve wide column"> <div class="ui forced-full-height"> <h4> Points and Tiers? </h4> <p> Vestibulum in ultricies sapien, eu lacinia ante. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus malesuada ipsum sed orci varius, et finibus felis lobortis. Aliquam commodo turpis ut augue volutpat pulvinar. Etiam vel mollis diam. Sed eu elit imperdiet, aliquam leo sit amet, pulvinar elit. Fusce vitae elementum odio. Curabitur tristique aliquam nisi, ut rhoncus ipsum consectetur in. Nunc at leo dolor. </p> </div> </div> </div> </div>', 'comp-stats .comp-stats,[data-is="comp-stats"] .comp-stats{ margin: 2vh !important; }', '', function(opts) {
        var self = this
        self.competition = {}
        CODALAB.events.on('competition_loaded', function(competition) {
            self.competition = competition
        })
});
riot.tag2('comp-tabs', '<div class="ui grid comp-tabs"> <div class="ui tiny fluid four secondary pointing tabular menu details-menu"> <div class="item" data-tab="pages-tab">Get Started</div> <div class="item" data-tab="phases-tab">Phases</div> <div class="item" data-tab="participate-tab">My Submissions</div> <div class="item" data-tab="results-tab">Results</div> <a if="{competition.forum_enabled}" class="item" href="{URLS.FORUM(competition.forum)}">Forum</a> <div class="right menu"> <div class="item"> <help_button href="https://docs.codabench.org/latest/Organizers/Running_a_benchmark/Competition-Detail-Page/" tooltip_position="left center"></help_button> </div> </div> </div> <div class="pages-tab ui tab" data-tab="pages-tab"> <div show="{loading}"> <loader></loader> </div> <div class="ui relaxed grid" show="{!loading}"> <div class="row"> <div class="four wide column"> <div class="ui side vertical tabular pages-menu menu"> <div each="{page, i in competition.pages}" class="{active: i === 0} item" data-tab="_tab_page{page.index}"> {page.title} </div> <div if="{competition_has_no_terms_page()}" class="item" data-tab="_tab_page_term"> Terms </div> <div if="{competition.files && competition.files.length != 0}" class="{active: _.get(competition.pages, \'length\') === 0} item" data-tab="files"> Files </div> </div> </div> <div class="twelve wide column"> <div each="{page, i in competition.pages}" class="ui {active: i === 0} tab" data-tab="_tab_page{page.index}"> <div class="ui" id="page_{i}"> </div> </div> <div if="{competition_has_no_terms_page()}" class="ui tab" data-tab="_tab_page_term"> <div class="ui" id="page_term"> </div> </div> <div class="ui tab {active: _.get(competition.pages, \'length\') === 0}" data-tab="files"> <div class="ui" id="files"> <div if="{!CODALAB.state.user.logged_in}" class="ui yellow message"> <a href="{URLS.LOGIN}?next={location.pathname}">Log In</a> or <a href="{URLS.SIGNUP}" target="_blank">Sign Up</a> to view availbale files. </div> <table if="{CODALAB.state.user.logged_in}" class="ui celled table"> <thead> <tr> <th class="index-column">Download</th> <th>Phase</th> <th>Task</th> <th>Type</th> <th if="{competition.is_admin}">Available <span class="ui mini circular icon button" data-tooltip="Available for download to participants." data-position="top center"> <i class="question icon"></i> </span> </th> <th>Size</th> </tr> </thead> <tbody> <tr class="file_row" each="{file in competition.files}"> <td> <a href="{URLS.DATASET_DOWNLOAD(file.key)}"> <div class="ui button">{file.name}</div> </a> </td> <td>{file.phase}</td> <td>{file.task}</td> <td>{file.type}</td> <td if="{competition.is_admin}" class="center aligned"> <i if="{file.available}" class="checkmark box icon green"></i> </td> <td>{pretty_bytes(file.file_size)}</td> </tr> <tr class="center aligned"> <td if="{competition.files === undefined ||competition.files.length === 0}" colspan="100%"> <em>No Files Available Yet</em> </td> </tr> </tbody> </table> </div> </div> </div> </div> </div> </div> <div class="phases-tab ui tab" data-tab="phases-tab"> <div show="{loading}"> <loader></loader> </div> <div class="ui relaxed grid" show="{!loading}"> <div class="row"> <div class="sixteen wide centered column"> <div class="ui styled accordion"> <virtual each="{phase, i in competition.phases}"> <div class="ui teal phase-header title {active: selected_phase_index === phase.id}"> <i class="ui dropdown icon"></i> {phase.name} </div> <div class="ui bottom attached content {active: selected_phase_index === phase.id}"> <div class="phase-label">Start:</div> <div class="phase-info">{pretty_date(phase.start)}</div> <div class="phase-label">End:</div> <div class="phase-info">{pretty_date(phase.end)}</div> <span class="phase-label">Description: </span> <div class="phase-markdown" id="phase_{i}"></div> </div> </virtual> </div> </div> </div> </div> </div> <div class="submission-tab ui tab" data-tab="participate-tab"> <div show="{loading}"> <loader></loader> </div> <div show="{!loading}"> <div if="{competition.participant_status === \'approved\'}"> <div class="ui button-container"> <div class="ui inline button {active: selected_phase_index == phase.id}" each="{phase in competition.phases}" onclick="{phase_selected.bind(this, phase)}">{phase.name} </div> </div> <div> <submission-limit></submission-limit> <submission-upload is_admin="{competition.is_admin}" competition="{competition}" phases="{competition.phases}" fact_sheet="{competition.fact_sheet}"></submission-upload> </div> <div> <submission-manager id="user-submission-table" competition="{competition}"></submission-manager> </div> </div> <div if="{competition.participant_status !== \'approved\'}"> <registration></registration> </div> </div> </div> <div class="results-tab ui tab" data-tab="results-tab"> <div show="{loading}"> <loader></loader> </div> <div show="{!loading}"> <div class="ui button-container inline"> <div class="ui button {active: selected_phase_index == phase.id}" each="{phase in competition.phases}" onclick="{phase_selected.bind(this, phase)}">{phase.name} </div> </div> <div show="{competition.admin}" class="float-right"> <div class="ui compact menu"> <div class="ui simple dropdown item" style="padding: 0px 5px"> <i class="download icon" style="font-size: 1.5em; margin: 0;"></i> <div style="padding-top: 8px; right: 0; left: auto;" class="menu"> <a href="{URLS.COMPETITION_GET_ZIP(competition.id)}" target="new" class="item">All CSV</a> <a href="{URLS.COMPETITION_GET_JSON(competition.id)}" target="new" class="item">All JSON</a> </div> </div> </div> </div> <div show="{_.isEmpty(competition.leaderboards)}"> <div class="center aligned"><h2>No visible leaderboard for this benchmark</h2></div> </div> <div show="{!_.isEmpty(competition.leaderboards)}"> <leaderboards class="leaderboard-table" phase_id="{self.selected_phase_index}" is_admin="{competition.admin}"> </leaderboards> </div> </div> </div> </div>', 'comp-tabs .leaderboard-table,[data-is="comp-tabs"] .leaderboard-table{ overflow: auto; } comp-tabs .comp-tabs,[data-is="comp-tabs"] .comp-tabs{ margin-top: 1em !important; } comp-tabs .ui.secondary.pointing.menu .active.item,[data-is="comp-tabs"] .ui.secondary.pointing.menu .active.item{ border-color: rgba(42,68,88,0.5); color: #2a4458; } comp-tabs .ui.secondary.pointing.menu .active.item:hover,[data-is="comp-tabs"] .ui.secondary.pointing.menu .active.item:hover{ border-color: rgba(42,68,88,0.5); color: #2a4458; } comp-tabs .inline,[data-is="comp-tabs"] .inline{ display: inline-block; } comp-tabs .float-right,[data-is="comp-tabs"] .float-right{ float: right; } comp-tabs .details-menu,[data-is="comp-tabs"] .details-menu{ width: 100%; } comp-tabs .details-menu .item,[data-is="comp-tabs"] .details-menu .item{ font-size: 1.3em; } comp-tabs .details-menu .active.item,[data-is="comp-tabs"] .details-menu .active.item,comp-tabs .details-menu .item,[data-is="comp-tabs"] .details-menu .item{ margin: -2px auto !important; cursor: pointer; } comp-tabs .home-tab,[data-is="comp-tabs"] .home-tab{ padding: 2em 0.5em; } comp-tabs .home-tab .short-description,[data-is="comp-tabs"] .home-tab .short-description{ font-size: 44px; font-weight: 600; color: #2c3f4c; line-height: 1em; } comp-tabs .home-tab .seven.column,[data-is="comp-tabs"] .home-tab .seven.column{ align-self: center; } comp-tabs .home-tab .long-description,[data-is="comp-tabs"] .home-tab .long-description{ border-left: solid 2px #0bb; color: #2c3f4c; font-size: 14px; padding: 10px; font-family: \'Overpass Mono\', monospace; } comp-tabs .home-tab .leaderboard,[data-is="comp-tabs"] .home-tab .leaderboard{ width: 100%; text-align: center; color: #2c3f4c; font-family: \'Overpass Mono\', monospace; } comp-tabs .home-tab .leaderboard table,[data-is="comp-tabs"] .home-tab .leaderboard table{ color: #2c3f4c !important; } comp-tabs .home-tab .leaderboard table thead > tr > th,[data-is="comp-tabs"] .home-tab .leaderboard table thead > tr > th{ color: #2c3f4c !important; background-color: #f2faff !important; } comp-tabs .home-tab .leaderboard table .medal,[data-is="comp-tabs"] .home-tab .leaderboard table .medal{ height: 25px; width: auto; } comp-tabs .submission-tab,[data-is="comp-tabs"] .submission-tab{ margin: 0 auto; width: 100%; } comp-tabs .results-tab,[data-is="comp-tabs"] .results-tab{ margin: 0 auto; width: 100%; } comp-tabs .pages-tab,[data-is="comp-tabs"] .pages-tab{ margin: 0 auto; width: 100%; } comp-tabs .pages-tab .ui.vertical.tabular.menu.pages-menu,[data-is="comp-tabs"] .pages-tab .ui.vertical.tabular.menu.pages-menu{ width: 100% !important; padding-right: 3px; } comp-tabs .pages-tab .vertical.tabular.menu > .item,[data-is="comp-tabs"] .pages-tab .vertical.tabular.menu > .item{ cursor: pointer; } comp-tabs .pages-tab .vertical.tabular.menu > .active.item,[data-is="comp-tabs"] .pages-tab .vertical.tabular.menu > .active.item{ z-index: 1; } comp-tabs .pages-tab .twelve.wide.column .tab.active,[data-is="comp-tabs"] .pages-tab .twelve.wide.column .tab.active{ z-index: 0; background-color: #fff; margin: 0 -2.9em; padding: 2em; border: solid 1px #dcdcdc; } comp-tabs .phases-tab,[data-is="comp-tabs"] .phases-tab{ margin: 0 auto; width: 100%; color: #2c3f4c; padding: 50px 0 150px; } comp-tabs .phases-tab .underline,[data-is="comp-tabs"] .phases-tab .underline{ border-bottom: 1px solid #0bb; display: inline-block; line-height: 0.9em; } comp-tabs .phases-tab .ui.segments,[data-is="comp-tabs"] .phases-tab .ui.segments{ font-family: \'Overpass Mono\', monospace; font-size: 14px; } comp-tabs .phases-tab .ui.styled.accordion,[data-is="comp-tabs"] .phases-tab .ui.styled.accordion{ width: 100%; } comp-tabs .phases-tab .phase-header,[data-is="comp-tabs"] .phases-tab .phase-header{ font-family: \'Roboto\', sans-serif; font-size: 20px !important; text-transform: uppercase; font-weight: 600; background-color: #e5fbfa; color: #2c3f4c !important; } comp-tabs .phases-tab .ui.styled.accordion .phase-header.active,[data-is="comp-tabs"] .phases-tab .ui.styled.accordion .phase-header.active{ color: #2c3f4c !important; border-bottom: solid 1px #dcdcdc !important; background: #05b5ad !important; } comp-tabs .phases-tab .phase-header:hover,[data-is="comp-tabs"] .phases-tab .phase-header:hover{ color: #2c3f4c !important; background: #05b5ad !important; } comp-tabs .phases-tab .phase-label,[data-is="comp-tabs"] .phases-tab .phase-label{ font-size: 15px; font-weight: 600; font-family: \'Roboto\', sans-serif; color: #0bb; text-transform: uppercase; } comp-tabs .phases-tab .phase-info,[data-is="comp-tabs"] .phases-tab .phase-info{ margin-bottom: 10px; } comp-tabs .admin-tab,[data-is="comp-tabs"] .admin-tab{ margin: 0 auto; width: 100%; } comp-tabs pre,[data-is="comp-tabs"] pre{ background: #f4f4f4; border: 1px solid #ddd; border-left: 3px solid #0bb; border-radius: 6px; color: #666; page-break-inside: avoid; font-family: monospace; font-size: 0.85em; line-height: 1.6; margin-bottom: 1.6em; max-width: 100%; overflow: auto; padding: 1em 1.5em; display: block; word-wrap: break-word; } comp-tabs .ui.table,[data-is="comp-tabs"] .ui.table{ color: #2c3f4c !important; } comp-tabs .ui.table thead > tr > th,[data-is="comp-tabs"] .ui.table thead > tr > th{ color: #2c3f4c !important; background-color: #f2faff !important; } comp-tabs .ui.table .medal,[data-is="comp-tabs"] .ui.table .medal{ height: 25px; width: auto; }', '', function(opts) {
        var self = this

        self.competition = {}
        self.files = {}
        self.selected_phase_index = undefined
        self.leaderboard_phases = []
        self.loading = true

        self.on('mount', function () {
            $('.tabular.menu.details-menu .item', self.root).tab({
                history: true,
                historyType: 'hash',
            })
        })

        CODALAB.events.on('competition_loaded', function (competition) {
            self.competition = competition
            self.competition.files = []
            _.forEach(competition.phases, phase => {
                _.forEach(phase.tasks, task => {

                    let input_data = {}
                    let reference_data = {}
                    let ingestion_program = {}
                    let scoring_program = {}
                    _.forEach(task.public_datasets, dataset => {
                        let type = 'input_data'
                        if(dataset.type === "input_data"){
                            type = 'Input Data'
                            input_data = {key: dataset.key, name: dataset.name, file_size: dataset.file_size, phase: phase.name, task: task.name, type: type, available: self.competition.make_input_data_available}
                        }else if(dataset.type === "reference_data"){
                            type = 'Reference Data'
                            reference_data = {key: dataset.key, name: dataset.name, file_size: dataset.file_size, phase: phase.name, task: task.name, type: type, available: false}
                        }else if(dataset.type === "ingestion_program"){
                            type = 'Ingestion Program'
                            ingestion_program = {key: dataset.key, name: dataset.name, file_size: dataset.file_size, phase: phase.name, task: task.name, type: type, available: self.competition.make_programs_available}
                        }else if(dataset.type === "scoring_program"){
                            type = 'Scoring Program'
                            scoring_program = {key: dataset.key, name: dataset.name, file_size: dataset.file_size, phase: phase.name, task: task.name, type: type, available: self.competition.make_programs_available}
                        }
                    })
                    if(self.competition.participant_status === 'approved' && self.competition.make_programs_available){
                        Object.keys(ingestion_program).length != 0 ? self.competition.files.push(ingestion_program) : null
                        Object.keys(scoring_program).length != 0 ? self.competition.files.push(scoring_program) : null
                    }if(self.competition.participant_status === 'approved' && self.competition.make_input_data_available){
                        Object.keys(input_data).length != 0 ? self.competition.files.push(input_data) : null
                    }
                    if(self.competition.admin && !self.competition.make_programs_available){
                        Object.keys(ingestion_program).length != 0 ? self.competition.files.push(ingestion_program) : null
                        Object.keys(scoring_program).length != 0 ? self.competition.files.push(scoring_program) : null
                    }
                    if(self.competition.admin && !self.competition.make_input_data_available){
                        Object.keys(input_data).length != 0 ? self.competition.files.push(input_data) : null
                    }
                    if(self.competition.admin){
                        Object.keys(reference_data).length != 0 ? self.competition.files.push(reference_data) : null
                    }

                })

                if(self.competition.participant_status === 'approved'){
                    _.forEach(phase.tasks, task => {
                        _.forEach(task.solutions, solution => {
                            soln = {
                                key: solution.data,
                                name: solution.name,
                                file_size: solution.size,
                                phase: phase.name,
                                task: task.name,
                                type: 'Solution',
                                available: true
                            }
                            Object.keys(solution).length != 0 ? self.competition.files.push(soln) : null
                        })
                    })
                    if (phase.starting_kit != null){
                        s_kit = {
                            key: phase.starting_kit.key,
                            name: phase.starting_kit.name,
                            file_size: phase.starting_kit.file_size,
                            phase: phase.name,
                            task: '-',
                            type: 'Starting Kit',
                            available: true
                        }
                        Object.keys(phase.starting_kit).length != 0 ? self.competition.files.push(s_kit) : null
                    }
                    if (phase.public_data != null){
                        p_data = {
                            key: phase.public_data.key,
                            name: phase.public_data.name,
                            file_size: phase.public_data.file_size,
                            phase: phase.name,
                            task: '-',
                            type: 'Public Data',
                            available: true
                        }
                        Object.keys(phase.public_data).length != 0 ? self.competition.files.push(p_data) : null
                    }
                }
            })

            self.competition.phases.forEach(function (phase, index) {

                phase_ended = false
                phase_started = false

                if((Date.parse(phase["start"]) - Date.parse(new Date())) > 0){

                    phase_started = false
                }else{

                    phase_started = true
                }

                if(phase_started){

                    if(phase["end"]){
                        if((Date.parse(phase["end"]) - Date.parse(new Date())) < 0){

                            phase_ended = true
                        }else{

                            phase_ended = false
                        }
                    }else{

                        phase_ended = false
                    }
                }
                self.competition.phases[index]["phase_ended"] = phase_ended
                self.competition.phases[index]["phase_started"] = phase_started
            })

            self.competition.is_admin = CODALAB.state.user.has_competition_admin_privileges(competition)

            self.selected_phase_index = _.get(_.find(self.competition.phases, {'status': 'Current'}), 'id')

            if (self.selected_phase_index == null) {
                self.selected_phase_index = _.get(_.find(self.competition.phases, {is_final_phase: true}), 'id')
            }

            if (self.selected_phase_index == null) {
                self.selected_phase_index = self.competition.phases[self.competition.phases.length - 1].id;
            }

            self.phase_selected(_.find(self.competition.phases, {id: self.selected_phase_index}))

            $('.phases-tab .accordion', self.root).accordion()

            $('.tabular.pages-menu.menu .item', self.root).tab()

            self.update()
            _.forEach(self.competition.pages, (page, index) => {

                const rendered_content = renderMarkdownWithLatex(page.content)
                $(`#page_${index}`)[0].innerHTML = ""
                rendered_content.forEach(node => {
                    $(`#page_${index}`)[0].appendChild(node.cloneNode(true));
                });

            })
            if(self.competition_has_no_terms_page()){
                const rendered_content = renderMarkdownWithLatex(self.competition.terms)
                $(`#page_term`)[0].innerHTML = ""
                rendered_content.forEach(node => {
                    $(`#page_term`)[0].appendChild(node.cloneNode(true));
                });
            }
            _.forEach(self.competition.phases, (phase, index) => {

                const rendered_content = renderMarkdownWithLatex(phase.description)
                $(`#phase_${index}`)[0].innerHTML = ""
                rendered_content.forEach(node => {
                    $(`#phase_${index}`)[0].appendChild(node.cloneNode(true));
                });
            })
            _.delay(() => {
                self.loading = false
                self.update()
            }, 500)
        })

        self.competition_has_no_terms_page = function () {
            var no_term_page = true
            if(self.competition.pages){
                self.competition.pages.forEach(function (page) {
                    if (page.title === "Terms") {
                        no_term_page = false
                    }
                })
            }
            return no_term_page
        }

        CODALAB.events.on('phase_selected', function (selected_phase) {
            self.selected_phase = selected_phase
            self.update()
        })

        self.pretty_date = function (date_string) {
            if (date_string != null) {
                return luxon.DateTime.fromISO(date_string).toLocaleString(luxon.DateTime.DATETIME_FULL)
            } else {
                return ''
            }
        }

        self.phase_selected = function (data, event) {
            if(data) {
                self.selected_phase_index = data.id
                self.update()
                CODALAB.events.trigger('phase_selected', data)
            }
        }

        self.update()

});

riot.tag2('comp-tags', '<div class="ui container relaxed grid"> <div align="center" class="row"> <div class="sixteen wide column"> <div class="ui"> <h1>Tags</h1> <div class="ui tag labels"> <a class="ui label"> <i class="icon settings"></i> Beginner </a> <a class="ui label"> <i class="icon wrench"></i> Mechanics </a> </div> </div> </div> </div> </div>', '', '', function(opts) {
        var self = this
        self.competition = {}
        CODALAB.events.on('competition_loaded', function(competition) {
            self.competition = competition
        })
});
riot.tag2('comp-detail-timeline', '<section> <canvas id="myChart" height="120" width="800"></canvas> </section>', 'comp-detail-timeline *,[data-is="comp-detail-timeline"] *{ box-sizing: border-box; } comp-detail-timeline section,[data-is="comp-detail-timeline"] section{ width: 70%; margin: 0 auto 2rem; } comp-detail-timeline .phase-date,[data-is="comp-detail-timeline"] .phase-date{ display: block; } comp-detail-timeline .progress-bar,[data-is="comp-detail-timeline"] .progress-bar{ display: flex; justify-content: space-between; list-style: none; padding: 0; margin: 0 0 1rem 0; } comp-detail-timeline .progress-bar li,[data-is="comp-detail-timeline"] .progress-bar li{ flex: 2; position: relative; padding: 0 0 14px 0; font-size: 0.875rem; line-height: 1.5; color: #0bb; font-weight: 600; white-space: nowrap; overflow: visible; min-width: 0; text-align: center; } comp-detail-timeline .progress-bar li:first-child,[data-is="comp-detail-timeline"] .progress-bar li:first-child,comp-detail-timeline .progress-bar li:last-child,[data-is="comp-detail-timeline"] .progress-bar li:last-child{ flex: 1; } comp-detail-timeline .progress-bar li:first-child,[data-is="comp-detail-timeline"] .progress-bar li:first-child{ text-align: left; } comp-detail-timeline .progress-bar li:last-child,[data-is="comp-detail-timeline"] .progress-bar li:last-child{ text-align: right; } comp-detail-timeline .progress-bar li:before,[data-is="comp-detail-timeline"] .progress-bar li:before{ content: ""; display: block; width: 12px; height: 12px; background-color: #e8e8e8; border-radius: 50%; border: 2px solid #f6f8fa; position: absolute; left: calc(50% - 6px); bottom: -7px; z-index: 3; transition: all 0.2s ease-in-out; } comp-detail-timeline .progress-bar li:first-child:before,[data-is="comp-detail-timeline"] .progress-bar li:first-child:before{ left: 0; } comp-detail-timeline .progress-bar li:last-child:before,[data-is="comp-detail-timeline"] .progress-bar li:last-child:before{ right: 0; left: auto; } comp-detail-timeline .progress-bar div,[data-is="comp-detail-timeline"] .progress-bar div{ transition: opacity 0.3s ease-in-out; } comp-detail-timeline .progress-bar li:not(.is-active) div,[data-is="comp-detail-timeline"] .progress-bar li:not(.is-active) div{ opacity: 0; } comp-detail-timeline .prog-span,[data-is="comp-detail-timeline"] .prog-span{ width: 100%; } comp-detail-timeline .progress-bar li:first-child .prog-span,[data-is="comp-detail-timeline"] .progress-bar li:first-child .prog-span{ width: 200%; left: 0 !important; } comp-detail-timeline .progress-bar .is-complete .prog-span,[data-is="comp-detail-timeline"] .progress-bar .is-complete .prog-span{ display: inherit; position: absolute; bottom: -2px; left: 50%; z-index: 2; background-image: linear-gradient(to right, #0bb, #0bb); height: 2px; } comp-detail-timeline .progress-bar .is-active:not(:last-child) .prog-span,[data-is="comp-detail-timeline"] .progress-bar .is-active:not(:last-child) .prog-span,comp-detail-timeline .progress-bar .is-active:not(:first-child) .prog-span,[data-is="comp-detail-timeline"] .progress-bar .is-active:not(:first-child) .prog-span{ display: inherit; position: absolute; bottom: -2px; left: 50%; z-index: 2; background-image: linear-gradient(to right, #dcdcdc, #dcdcdc); height: 2px; } comp-detail-timeline .progress-bar li:last-child div,[data-is="comp-detail-timeline"] .progress-bar li:last-child div{ display: block; position: relative; } comp-detail-timeline .progress-bar .is-complete:before,[data-is="comp-detail-timeline"] .progress-bar .is-complete:before{ background-color: #0bb; } comp-detail-timeline .progress-bar .is-active:before,[data-is="comp-detail-timeline"] .progress-bar .is-active:before,comp-detail-timeline .progress-bar li:hover:before,[data-is="comp-detail-timeline"] .progress-bar li:hover:before,comp-detail-timeline .progress-bar .is-hovered:before,[data-is="comp-detail-timeline"] .progress-bar .is-hovered:before{ background-color: #f6f8fa; border-color: #0bb; } comp-detail-timeline .progress-bar li:hover:before,[data-is="comp-detail-timeline"] .progress-bar li:hover:before,comp-detail-timeline .progress-bar .is-hovered:before,[data-is="comp-detail-timeline"] .progress-bar .is-hovered:before{ transform: scale(1.33); } comp-detail-timeline .progress-bar li:hover div,[data-is="comp-detail-timeline"] .progress-bar li:hover div,comp-detail-timeline .progress-bar li.is-hovered div,[data-is="comp-detail-timeline"] .progress-bar li.is-hovered div{ opacity: 1; } comp-detail-timeline .progress-bar:hover li:not(:hover) div,[data-is="comp-detail-timeline"] .progress-bar:hover li:not(:hover) div{ opacity: 0; } comp-detail-timeline .progress-bar .has-changes,[data-is="comp-detail-timeline"] .progress-bar .has-changes{ opacity: 1 !important; } comp-detail-timeline .progress-bar .has-changes:before,[data-is="comp-detail-timeline"] .progress-bar .has-changes:before{ content: ""; display: block; width: 12px; height: 12px; position: absolute; left: calc(50% - 4px); bottom: -20px; background-image: url("data:image/svg+xmlcharset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%208%208%22%3E%3Cpath%20fill%3D%22%23ed1c24%22%20d%3D%22M4%200l4%208H0z%22%2F%3E%3C%2Fsvg%3E"); }', '', function(opts) {
        var self = this

        self.phase_timeline = []
        self.point_styles = []

        CODALAB.events.on('competition_loaded', function (competition) {
            competition.admin_privilege = CODALAB.state.user.has_competition_admin_privileges(competition)
            self.phases = competition.phases
            self.make_phase_timeline(competition.phases)
            self.get_competition_progress()
            self.update()
            self.draw_chart()
        })

        self.draw_chart = function () {
            let ctx = document.getElementById('myChart').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    datasets: [

                        {
                            ...self.get_competition_progress(),
                            borderWidth: 5,
                            borderColor: '#00bbbb',
                            pointBackgroundColor: '#00bbbb',
                            borderCapStyle: 'round',
                        },

                        {
                            data: _.map(self.phase_timeline, phase => ({x: self.get_date(phase.time), y: 0})),
                            label: _.map(self.phase_timeline, phase => phase.name),
                            borderWidth: 4,
                            pointBackgroundColor: '#4a4a4a',
                            borderColor: '#4a4a4a',
                            pointStyle: self.point_styles
                        }]
                },
                options: {
                    layout: {
                        padding: {
                            left: 50,
                            right: 50,
                        }
                    },
                    scales: {
                        yAxes: [{
                            display: false,
                            gridLines: {
                                display: false
                            },
                        }],
                        xAxes: [{
                            type: 'time',
                            time: {
                                unit: 'month',
                            },
                            display: true,
                            gridLines: {
                                display: true
                            },
                        }]
                    },
                    legend: {
                        display: false
                    },
                    tooltips: {
                        backgroundColor: '#fff',
                        borderColor: '#DCDCDC',
                        borderWidth: 1,
                        titleFontSize: 12,
                        titleFontColor: '#2d3f4b',
                        bodyFontColor: '#2d3f4b',
                        displayColors: false,
                        callbacks: {
                            label: function (tooltipItem, data) {
                                let title = _.get(data.datasets[tooltipItem.datasetIndex], `label[${tooltipItem.index}]`, 'N/A')
                                if (title === 'Competition Never Ends') {
                                    return ''
                                }
                                return pretty_date(new Date(tooltipItem.xLabel).toISOString())
                            },
                            title: function (tooltipItem, data) {
                                tooltipItem = _.head(tooltipItem)
                                return _.get(data.datasets[tooltipItem.datasetIndex], `label[${tooltipItem.index}]`, 'N/A')
                            }
                        }
                    }
                }
            })
        }

        self.get_date = function (phase_date) {
            var date = new Date(phase_date)
            return date.toUTCString()
        }

        self.get_competition_progress = function () {

            let now = new Date()
            let past_phases = _.filter(self.phase_timeline, phase => phase.time < now)

            let data = {
                data: _.map(past_phases, phase => ({x: phase.time, y: 0})),
                label: _.map(past_phases, phase => phase.name),
                pointStyle: _.map(past_phases, phase => 'circle')
            }
            if (past_phases.length < self.phase_timeline.length) {
                data.data.push({x: new Date().getTime(), y: 0})
                data.label.push('Today')
                data.pointStyle.push('line')
            }

            return data
        }

        self.make_phase_timeline = function (phases) {
            _.forEach(phases, function (phase) {
                self.phase_timeline.push({
                    time: new Date(phase.start).getTime(),
                    name: `${phase.name} Start`,
                })
                self.point_styles.push('circle')
                if (phase.end) {
                    self.phase_timeline.push({
                        time: new Date(phase.end).getTime(),
                        name: `${phase.name} End`,
                    })
                    self.point_styles.push('circle')
                } else {
                    self.phase_timeline.push({
                        time: new Date().setDate(new Date().getDate() + 90),
                        name: 'Competition Never Ends',
                    })
                    self.point_styles.push('line')
                }

            })
        }
});

riot.tag2('competition-detail', '<comp-detail-header class="comp-detail-paragraph-text" competition="{competition}"></comp-detail-header> <comp-detail-timeline class="comp-detail-phases" competition="{competition}"></comp-detail-timeline> <comp-tabs class="comp-detail-paragraph-text" competition="{competition}"></comp-tabs>', 'competition-detail .comp-detail-paragraph-text,[data-is="competition-detail"] .comp-detail-paragraph-text{ font-size: 16px !important; line-height: 20px !important; } competition-detail,[data-is="competition-detail"]{ display: block; width: 100%; height: 100%; } competition-detail .ui.inverted.table,[data-is="competition-detail"] .ui.inverted.table{ background: #44586b; } competition-detail .ui.modal,[data-is="competition-detail"] .ui.modal{ margin: 20px; } competition-detail .ui.table,[data-is="competition-detail"] .ui.table{ color: $blue !important; } competition-detail .ui.table thead > tr > th,[data-is="competition-detail"] .ui.table thead > tr > th{ color: $blue !important; background-color: $lightblue !important; }', '', function(opts) {
        var self = this

        self.competition = {}

        self.one("mount", function () {

            $('.menu .item', self.root).tab()

            self.update_competition_data()
        })

        self.update_competition_data = function () {
            CODALAB.api.get_competition(self.opts.competition_pk, self.opts.secret_key)
                .done(function (data) {
                    self.competition = data
                    CODALAB.events.trigger('competition_loaded', self.competition)
                    let selected_phase_index = _.get(_.find(self.competition.phases, {'status': 'Current'}), 'id')
                    if (selected_phase_index == null) {
                        selected_phase_index = _.get(_.find(self.competition.phases, {is_final_phase: true}), 'id')
                    }
                    CODALAB.events.trigger('phase.selected',(_.find(self.competition.phases, {id: selected_phase_index})))
                    self.update()
                })
                .fail(function (response) {
                    toastr.error("Could not find benchmark")
                })
        }

        CODALAB.events.on('new_submission_created', function (new_submission_data) {
            self.update_competition_data()
        })

});

riot.tag2('leaderboards', '<div class="ui left action input" style="margin-top: 32px; width: 33%"> <button type="button" class="ui icon button" id="search-leaderboard-button"> <i class="search icon"></i> </button> <input ref="leaderboardFilter" type="text" placeholder="Filter Leaderboard by Columns"> </div> <a data-tooltip="Start typing to filter columns under \'Meta-data\' or Tasks." data-position="right center"> <i class="grey question circle icon"></i> </a> <table id="leaderboardTable" class="ui celled selectable sortable table"> <thead> <tr> <th colspan="100%" class="center aligned"> <p class="leaderboard-title">{selected_leaderboard.title}</p> <div riot-style="visibility:{show_download}" class="float-right"> <div class="ui compact menu"> <div class="ui simple dropdown item" style="padding: 0px 5px"> <i class="download icon" style="font-size: 1.5em; margin: 0;"></i> <div style="padding-top: 8px; right: 0; left: auto;" class="menu"> <a href="{URLS.COMPETITION_GET_CSV(competition_id, selected_leaderboard.id)}" target="new" class="item">This CSV</a> <a href="{URLS.COMPETITION_GET_JSON_BY_ID(competition_id, selected_leaderboard.id)}" target="new" class="item">This JSON</a> </div> </div> </div> </div> </th> </tr> <tr class="task-row"> <th>Task:</th> <th colspan="3"></th> <th each="{task in filtered_tasks}" class="center aligned" colspan="{task.colWidth}">{task.name}</th> </tr> <tr> <th class="center aligned">#</th> <th>Participant</th> <th>Date</th> <th>ID</th> <th each="{column in filtered_columns}" colspan="1">{column.title}</th> </tr> </thead> <tbody> <tr if="{_.isEmpty(selected_leaderboard.submissions)}" class="center aligned"> <td colspan="100%"> <em>No submissions have been added to this leaderboard yet!</em> </td> </tr> <tr each="{submission, index in selected_leaderboard.submissions}"> <td class="collapsing index-column center aligned"> <gold-medal if="{index + 1 === 1}"></gold-medal> <silver-medal if="{index + 1 === 2}"></silver-medal> <bronze-medal if="{index + 1 === 3}"></bronze-medal> <fourth-place-medal if="{index + 1 === 4}"></fourth-place-medal> <fifth-place-medal if="{index + 1 === 5}"></fifth-place-medal> <virtual if="{index + 1 > 5}">{index + 1}</virtual> </td> <td if="{submission.organization === null}"><a href="{submission.slug_url}">{submission.owner}</a></td> <td if="{submission.organization !== null}"><a href="{submission.organization.url}">{submission.organization.name}</a></td> <td>{pretty_date(submission.created_when)}</td> <td>{submission.id}</td> <td each="{column in filtered_columns}"> <a if="{column.title == \'Detailed Results\'}" href="detailed_results/{get_detailed_result_submisison_id(column, submission)}" target="_blank" class="eye-icon-link"> <i class="icon grey eye eye-icon"></i> </a> <span if="{column.title != \'Detailed Results\'}" class="{bold_class(column, submission)}">{get_score(column, submission)}</span> </td> </tr> </tbody> </table>', 'leaderboards,[data-is="leaderboards"]{ display: block; width: 100%; height: 100%; } leaderboards .celled.table.selectable,[data-is="leaderboards"] .celled.table.selectable{ margin: 1em 0; } leaderboards table tbody .center.aligned td,[data-is="leaderboards"] table tbody .center.aligned td{ color: #8c8c8c; } leaderboards .index-column,[data-is="leaderboards"] .index-column{ min-width: 55px; } leaderboards .leaderboard-title,[data-is="leaderboards"] .leaderboard-title{ position: absolute; left: 50%; transform: translate(-50%, -50%); } leaderboards .ui.table > thead > tr.task-row > th,[data-is="leaderboards"] .ui.table > thead > tr.task-row > th{ background-color: #e8f6ff !important; } leaderboards .eye-icon-link,[data-is="leaderboards"] .eye-icon-link{ position: relative; display: block; } leaderboards .eye-icon,[data-is="leaderboards"] .eye-icon{ position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); } leaderboards .text-bold,[data-is="leaderboards"] .text-bold{ font-weight: bold; }', '', function(opts) {
        let self = this
        self.selected_leaderboard = {}
        self.filtered_tasks = []
        self.columns = []
        self.filtered_columns = []
        self.phase_id = null
        self.competition_id = null
        self.enable_detailed_results = false
        self.show_detailed_results_in_leaderboard = false

        self.pretty_date = function (date_string) {
            if (!!date_string) {
                return luxon.DateTime.fromISO(date_string).toFormat('yyyy-MM-dd HH:mm')
            } else {
                return ''
            }
        }

        self.bold_class = function(column, submission){

            return_class = ''
            if(column.task_id != -1){
                if(submission.scores.length > 1){
                    let column_index = _.get(column, 'index')
                    if(column_index === self.selected_leaderboard.primary_index){
                        return_class = 'text-bold'
                    }
                }
            }
            return return_class
        }
        self.get_score = function(column, submission) {
            if(column.task_id === -1){
                return _.get(submission, 'fact_sheet_answers[' + column.key + ']', 'n/a')
            } else {
                let score = _.get(_.find(submission.scores, {'task_id': column.task_id, 'column_key': column.key}), 'score')
                if (score) {
                    return score
                }
            }
            return 'n/a'
        }

        self.on("mount" , function () {
            this.refs.leaderboardFilter.onkeyup = function (e) {
                self.filter_columns()
            }
            $('#search-leaderboard-button').click(function() {
                $(self.refs.leaderboardFilter).focus()
            })
            $('#leaderboardTable').tablesort()
        })

        self.filter_columns = () => {
            let search_key = self.refs.leaderboardFilter.value.toLowerCase()
            self.filtered_tasks = JSON.parse(JSON.stringify(self.selected_leaderboard.tasks))
            if(search_key){
                self.filtered_columns = []
                for (const column of self.columns){
                    let key = column.key.toLowerCase()
                    let title = column.title.toLowerCase()
                    if((key.includes(search_key) || title.includes(search_key))) {
                        self.filtered_columns.push(column)
                    }
                    else {
                        let task = _.find(self.filtered_tasks, {id: column.task_id})
                        task.colWidth -= 1
                    }
                }
                self.filtered_tasks = self.filtered_tasks.filter(task => task.colWidth > 0)
            } else {
                self.filtered_columns = self.columns
            }
            self.update()
        }

        self.update_leaderboard = () => {
            CODALAB.api.get_leaderboard_for_render(self.phase_id)
                .done(responseData => {
                    self.selected_leaderboard = responseData
                    self.columns = []

                    if(self.selected_leaderboard.fact_sheet_keys){
                        let fake_metadata_task = {
                            id: -1,
                            colWidth: self.selected_leaderboard.fact_sheet_keys.length,
                            columns: [],
                            name: "Fact Sheet Answers"
                        }
                        for(question of self.selected_leaderboard.fact_sheet_keys){
                            fake_metadata_task.columns.push({
                                key: question[0],
                                title: question[1],
                            })
                        }
                        self.selected_leaderboard.tasks.unshift(fake_metadata_task)
                    }
                    for(task of self.selected_leaderboard.tasks){

                        for(column of task.columns){
                            column.task_id = task.id
                            self.columns.push(column)
                        }

                        if(self.enable_detailed_results & self.show_detailed_results_in_leaderboard & task.id != -1){
                            self.columns.push({
                              task_id: task.id,
                              title: "Detailed Results"
                            })
                            task.colWidth += 1
                        }
                    }
                    self.filter_columns()
                    $('#leaderboardTable').tablesort()
                    self.update()
                })
        }

        self.get_detailed_result_submisison_id = function(column, submisison){
            for (index in submisison.detailed_results) {
                if(column.task_id == submisison.detailed_results[index].task){
                    return submisison.detailed_results[index].id
                }
            }
        }

        CODALAB.events.on('phase_selected', data => {
            self.phase_id = data.id
            self.update_leaderboard()
        })

        CODALAB.events.on('competition_loaded', (competition) => {
            self.competition_id = competition.id
            self.participant_status = competition.participant_status
            self.opts.is_admin ? self.show_download = "visible": self.show_download = "hidden"
            self.enable_detailed_results = competition.enable_detailed_results
            self.show_detailed_results_in_leaderboard = competition.show_detailed_results_in_leaderboard

        })

        CODALAB.events.on('submission_changed_on_leaderboard', self.update_leaderboard)

});

riot.tag2('log_window', '<div if="{!opts.split_logs}"> <pre class="submission_output"><virtual if="{opts.lines === undefined}">Preparing submission... this may take a few moments..</virtual><virtual each="{line in opts.lines}">{line}</virtual></pre> </div> <div if="{opts.split_logs}"> <div>Scoring</div> <pre class="submission_output"><virtual if="{_.get(opts.lines, \'program\') === undefined}">Preparing submission... this may take a few moments..</virtual><virtual each="{line in _.get(opts.lines, \'program\', [])}">{line}</virtual></pre> <div>Ingestion</div> <pre class="submission_output"><virtual if="{_.get(opts.lines, \'ingestion\') === undefined}">Preparing submission... this may take a few moments..</virtual><virtual each="{line in _.get(opts.lines, \'ingestion\', [])}">{line}</virtual></pre> </div> <div class="graph-container" show="{opts.show_graph && opts.detailed_result_url}"> <iframe riot-src="{opts.detailed_result_url}" class="graph-frame"></iframe> </div>', 'log_window .graph-frame,[data-is="log_window"] .graph-frame{ width: 100%; height: 70vh; border: none; overflow: scroll; } log_window .submission_output,[data-is="log_window"] .submission_output{ height: 400px; padding: 15px !important; overflow: auto; }', '', function(opts) {
        let self = this

});

riot.tag2('participant-manager', '<div show="{participants}"> <div class="ui icon input"> <input type="text" placeholder="Search..." ref="participant_search" onkeyup="{search_participants}"> <i class="search icon"></i> </div> <select ref="participant_status" class="ui dropdown" onchange="{update_participants.bind(this, undefined)}"> <option value="">Status</option> <option value="-">----</option> <option value="approved">Approved</option> <option value="pending">Pending</option> <option value="denied">Denied</option> <option value="unknown">Unknown</option> </select> <div class="ui checkbox"> <input type="checkbox" ref="participant_show_deleted" onchange="{update_participants.bind(this, undefined)}"> <label>Show deleted accounts</label> </div> <div style="margin-top: 1em;"> <div class="ui blue icon button" onclick="{show_email_modal.bind(this, undefined)}"> <i class="envelope icon"></i> Email all participants </div> <div class="ui blue icon button" onclick="{download_participants_csv}"> <i class="download icon"></i> Download all participants </div> </div> <table class="ui celled striped table"> <thead> <tr> <th>Username</th> <th>Email</th> <th>Is Bot?</th> <th>Status</th> <th class="center aligned">Actions</th> </tr> </thead> <tbody> <tr each="{participants}"> <td><a href="/profiles/user/{username}" target="_BLANK">{username}</a></td> <td>{email}</td> <td>{is_bot}</td> <td>{is_deleted ? ⁗account deleted⁗ : _.startCase(status)}</td> <td class="right aligned"> <button class="mini ui red button icon" show="{status !== \'denied\'}" onclick="{revoke_permission.bind(this, id)}" data-tooltip="Revoke" data-inverted="" data-position="bottom center" disabled="{is_deleted}"> <i class="close icon"></i> </button> <button class="mini ui green button icon" show="{status !== \'approved\'}" onclick="{approve_permission.bind(this, id)}" data-tooltip="Approve" data-inverted="" data-position="bottom center" disabled="{is_deleted}"> <i class="checkmark icon"></i> </button> <button class="mini ui blue button icon" data-tooltip="Send Message" data-inverted="" data-position="bottom center" onclick="{show_email_modal.bind(this, id)}" disabled="{is_deleted}"> <i class="envelope icon"></i> </button> </td> </tr> </tbody> </table> </div> <div class="ui modal" ref="email_modal"> <div class="header"> Send Email </div> <div class="content"> <div class="ui form"> <div class="field"> <label>Subject</label> <input type="text" riot-value="A message from the admins of {competition_title}" disabled> </div> <div class="field"> <label>Content</label> <textarea class="markdown-editor" ref="email_content" name="content"></textarea> </div> </div> </div> <div class="actions"> <div class="ui cancel icon red small button"><i class="trash alternate icon"></i></div> <div class="ui icon small button" onclick="{send_email}"><i class="paper plane icon"></i></div> </div> </div>', '', '', function(opts) {
        let self = this
        self.competition_id = undefined
        self.selected_participant = undefined
        self.competition_title = undefined

        self.on('mount', () => {
            $(self.refs.participant_status).dropdown()
            self.markdown_editor = create_easyMDE(self.refs.email_content)
            $(self.refs.email_modal).modal({
                onHidden: self.clear_form,
                onShow: () => {
                    _.delay(() => {self.markdown_editor.codemirror.refresh()}, 5)
                }
            })
        })

        self.clear_form = function () {
            self.markdown_editor.value('')
            self.update()
        }

        CODALAB.events.on('competition_loaded', function(competition) {
            self.competition_title = competition.title
            self.competition_id = competition.id
            self.update_participants()
        })

        self.send_email = function () {
            let content = render_markdown(self.refs.email_content.value)
            let func = self.selected_participant
                ? _.partial(CODALAB.api.email_participant, self.selected_participant)
                : _.partial(CODALAB.api.email_all_participants, self.competition_id)
            func(content)
                .done(() => {
                    toastr.success('Sent')
                    self.close_email_modal()
                })
                .fail((resp) => {
                    toastr.error('Error sending email')
                })
        }

        self.update_participants = filters => {
            if (!CODALAB.state.user.logged_in) {
                return
            }
            filters = filters || {}
            filters.competition = self.competition_id
            let status = self.refs.participant_status.value
            if (status && status !== '-') {
                filters.status = status
            }

            let show_deleted_users = self.refs.participant_show_deleted.checked
            if (show_deleted_users !== null && show_deleted_users === false) {
                filters.user__is_deleted = show_deleted_users
            }

            CODALAB.api.get_participants(filters)
                .done(participants => {
                    self.participants = participants
                    self.update()
                })
                .fail(() => {
                    toastr.error('Error returning competition participants')
                })
        }

        self._update_status = (id, status) => {
            CODALAB.api.update_participant_status(id, {status: status})
                .done(() => {
                    if(status === 'denied'){
                        toastr.success('Revoked successfully')
                    }else{
                        toastr.success('Approved successfully')
                    }
                    self.update_participants()
                })
                .fail((resp) => {
                    let errorMessage = 'An error occurred while updating the status.'
                    if (resp.responseJSON && resp.responseJSON.error) {
                        errorMessage = resp.responseJSON.error
                    }
                    toastr.error(errorMessage)
                })
        }

        self.revoke_permission = id => {
            if (confirm("Are you sure you want to revoke this user's permissions?")) {
                self._update_status(id, 'denied')
            }
        }

        self.approve_permission = id => {
            if (confirm("Are you sure you want to accept this user's participation request?")) {
                self._update_status(id, 'approved')
            }
        }

        self.search_participants = () => {
            let filter = self.refs.participant_search.value
            delay(() => self.update_participants({search: filter}), 100)
        }

        self.show_email_modal = (participant_pk) => {
            self.selected_participant = participant_pk
            $(self.refs.email_modal).modal('show')
        }

        self.close_email_modal = () => {
            $(self.refs.email_modal).modal('hide')
        }

        self.download_participants_csv = () => {

            if (!self.participants || self.participants.length === 0) {
                toastr.warning('No participants to download')
                return
            }

            const headers = ['ID', 'Username', 'Email', 'Is Bot', 'Status'];

            const rows = self.participants.map(p => [
                p.id,
                p.username,
                p.email,
                p.is_bot ? 'Yes' : 'No',
                p.status
            ]);

            const csvContent = [headers, ...rows]
                .map(e => e.map(v => `"${(v ?? '').toString().replace(/"/g, '""')}"`).join(','))
                .join('\n')

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
            const url = URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.setAttribute("href", url)
            link.setAttribute("download", "participants.csv")
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        }

});

riot.tag2('submission-limit', '<div class="ui sixteen wide column submission-container"> <div class="col"> <div class="col-content"> Number of submissions used for the day <a class="float-left" data-tooltip="The submission limit resets at midnight server time." data-position="right center"> <i class="grey question circle icon"></i> </a> </div> <span if="{selected_phase.max_submissions_per_day > 0}" class="badge {badgeColor(selected_phase.used_submissions_per_day, selected_phase.max_submissions_per_day)}"> {selected_phase.used_submissions_per_day} out of {selected_phase.max_submissions_per_day} </span> <span if="{selected_phase.max_submissions_per_day == 0}" class="badge badge-green"> {selected_phase.used_submissions_per_day} out of ∞ </span> </div> <div class="col"> <div class="col-content"> Number of total submissions used </div> <span if="{selected_phase.max_submissions_per_person > 0}" class="badge {badgeColor(selected_phase.used_submissions_per_person, selected_phase.max_submissions_per_person)}"> {selected_phase.used_submissions_per_person} out of {selected_phase.max_submissions_per_person} </span> <span if="{selected_phase.max_submissions_per_person == 0}" class="badge badge-green"> {selected_phase.used_submissions_per_person} out of ∞ </span> </div> </div>', 'submission-limit .submission-container,[data-is="submission-limit"] .submission-container{ margin-top: 1em; background-color: #fff; padding: 2em; border: solid 1px rgba(220,220,220,0.863); display: flex; } submission-limit .col,[data-is="submission-limit"] .col{ flex: 1; display: flex; flex-direction: column; justify-content: space-between; } submission-limit .col-content,[data-is="submission-limit"] .col-content{ font-weight: bold; text-align: center; } submission-limit .badge,[data-is="submission-limit"] .badge{ padding: 0.5em 1em; text-align: center; display: inline-block; width: max-content; margin: 0 auto; margin-top: 0.5em; border-radius: 5px; } submission-limit .badge-green,[data-is="submission-limit"] .badge-green{ background-color: #a5d6a7; } submission-limit .badge-yellow,[data-is="submission-limit"] .badge-yellow{ background-color: #fff59d; } submission-limit .badge-orange,[data-is="submission-limit"] .badge-orange{ background-color: #ffcc80; } submission-limit .badge-pink,[data-is="submission-limit"] .badge-pink{ background-color: #ff80ab; } submission-limit .badge-red,[data-is="submission-limit"] .badge-red{ background-color: #e57373; }', '', function(opts) {
        var self = this;
        self.selected_phase = {}

        self.badgeColor = function(used, max) {

            var percentage = (used / max) * 100;

            if (percentage < 5) {
                return "badge-green";
            } else if (percentage < 25) {
                return "badge-yellow";
            } else if (percentage >= 25 && percentage < 50) {
                return "badge-orange";
            } else if (percentage >= 50 && percentage < 75) {
                return "badge-pink";
            } else {
                return "badge-red";
            }
        };

        CODALAB.events.on('phase_selected', function (selected_phase) {
            self.selected_phase = selected_phase;
            self.update();
        });

});

riot.tag2('submission-manager', '<div if="{opts.admin}" class="admin-buttons"> <div class="ui dropdown button" ref="rerun_button"> <i class="icon redo"></i> <div class="text">Rerun all submissions per phase</div> <div class="menu"> <div class="header">Select a phase</div> <div class="parent-modal item" each="{phase in opts.competition.phases}" onclick="{rerun_phase.bind(this, phase)}"> {phase.name} </div> </div> </div> <a class="ui button" href="{csv_link}"> <i class="icon download"></i>Download as CSV </a> <select class=" ui dropdown floated right " ref="submission_handling_operation"> <option value="delete"> Delete selected submissions</option> <option value="download">Download selected submissions</option> <option value="rerun">Rerun selected submissions</option> </select> <button type="button" class="ui button right" disabled="{checked_submissions.length === 0}" onclick="{submission_handling.bind(this)}"> Apply </button> </div> <div class="ui icon input"> <input type="text" placeholder="Search..." ref="search" onkeyup="{filter}"> <i class="search icon"></i> </div> <select if="{opts.admin}" class="ui dropdown" ref="phase" onchange="{filter}"> <option value="">Phase</option> <option value=" ">-----</option> <option each="{phase in opts.competition.phases}" riot-value="{phase.id}">{phase.name}</option> </select> <select class="ui dropdown" ref="status" onchange="{filter}"> <option value="">Status</option> <option value=" ">-----</option> <option value="Cancelled">Cancelled</option> <option value="Failed">Failed</option> <option value="Finished">Finished</option> <option value="Preparing">Preparing</option> <option value="Running">Running</option> <option value="Scoring">Scoring</option> <option value="Submitted">Submitted</option> <option value="Submitting">Submitting</option> </select> <div class="ui input" if="{opts.admin}"> <input type="checkbox" checked="{show_is_soft_deleted}" onclick="{toggleShowSoftDeleted}"> <label class="checkbox-label">Show soft-deleted submissions</label> </div> <table class="ui celled selectable sortable table" ref="submission_table"> <thead> <tr> <th if="{opts.admin}"> <div class="ui checkbox" onclick="{select_all_pressed.bind(this)}"> <input type="checkbox" name="select_all"> <label>All</label> </div> </th> <th class="sorted descending collapsing">ID #</th> <th>File name</th> <th if="{opts.admin}">Owner</th> <th if="{opts.admin}">Phase</th> <th>Date</th> <th>Status</th> <th>Score</th> <th if="{opts.competition.enable_detailed_results && opts.competition.show_detailed_results_in_submission_panel}"> Detailed Results </th> <th class="center aligned">Actions</th> </tr> </thead> <tbody> <tr if="{_.isEmpty(submissions) && !loading}" class="center aligned"> <td colspan="100%"><em>No submissions found! Please make a submission</em></td> </tr> <tr if="{loading}" class="center aligned"> <td colspan="100%"> <em>Loading Submissions...</em> </td> </tr> <tr show="{!loading}" each="{submission, index in filter_children(submissions)}" onclick="{submission_clicked.bind(this, submission)}" class="submission_row {submission.is_soft_deleted ? \'soft-deleted\' : \'\'}"> <td if="{opts.admin}"> <div if="{!submission.is_soft_deleted}" class="ui checkbox" onclick="{on_submission_checked.bind(this)}"> <input type="checkbox" name="{submission.id}"> <label></label> </div> </td> <td>{submission.id}</td> <td>{submission.filename}</td> <td if="{opts.admin}">{submission.owner}</td> <td if="{opts.admin}">{submission.phase.name}</td> <td>{pretty_date(submission.created_when)}</td> <td class="right aligned collapsing"> {submission.status} <sup data-tooltip="{submission.status_details}"> <i if="{submission.status === \'Failed\'}" class="failed question circle icon"></i> </sup> <sup data-tooltip="An organizer will run your submission soon"> <i if="{submission.status === \'Submitting\' && !submission.auto_run}" class="question circle icon"></i> </sup> </td> <td>{get_score(submission)}</td> <td if="{opts.competition.enable_detailed_results && opts.competition.show_detailed_results_in_submission_panel}"> <a if="{submission.status === \'Finished\'}" href="detailed_results/{submission.id}" target="_blank" class="eye-icon-link"> <i class="icon grey eye eye-icon"></i> </a> </td> <td if="{submission.is_soft_deleted}"></td> <td class="center aligned" if="{!submission.is_soft_deleted}"> <virtual if="{opts.admin}"> <span data-tooltip="{submission.status === \'Submitting\' && !submission.auto_run ? \'Run Submission\' : \'Rerun Submission\'}" data-inverted="" onclick="{submission.status === \'Submitting\' && !submission.auto_run ? run_submission.bind(this, submission) : rerun_submission.bind(this, submission)}"> <i class="icon {submission.status === \'Submitting\' && !submission.auto_run ? \'green play\' : \'blue redo\'}"></i> </span> <span data-tooltip="Delete Submission" data-inverted="" onclick="{delete_submission.bind(this, submission)}"> <i class="icon red trash alternate"></i> </span> </virtual> <span if="{!_.includes([\'Finished\', \'Cancelled\', \'Unknown\', \'Failed\'], submission.status)}" data-tooltip="Cancel Submission" data-inverted="" onclick="{cancel_submission.bind(this, submission)}"> <i class="grey minus circle icon"></i> </span> <span if="{!submission.on_leaderboard && submission.status === \'Finished\'}" data-tooltip="Add to Leaderboard" data-inverted="" onclick="{add_to_leaderboard.bind(this, submission)}"> <i class="icon green columns"></i> </span> <span if="{submission.on_leaderboard}" data-tooltip="On the Leaderboard" data-inverted="" onclick="{remove_from_leaderboard.bind(this, submission)}"> <i class="icon green check"></i> </span> <span if="{!submission.is_public && submission.status === \'Finished\' && submission.can_make_submissions_public}" data-tooltip="Make Public" data-inverted="" onclick="{toggle_submission_is_public.bind(this, submission)}"> <i class="icon share teal alternate"></i> </span> <span if="{!!submission.is_public && submission.status === \'Finished\' && submission.can_make_submissions_public}" data-tooltip="Make Private" data-inverted="" onclick="{toggle_submission_is_public.bind(this, submission)}"> <i class="icon share grey alternate"></i> </span> <span if="{((submission.status === \'Finished\' && !submission.on_leaderboard) || submission.status === \'Failed\' || submission.status === \'Cancelled\')  && !opts.admin}" data-tooltip="Delete Submission" data-inverted="" onclick="{soft_delete_submission.bind(this, submission)}"> <i class="icon red trash"></i> </span> </td> </tr> </tbody> </table> <div class="ui large modal" ref="modal"> <div class="content"> <div if="{!!selected_submission && !_.get(selected_submission, \'has_children\', false)}"> <submission-modal hide_output="{selected_phase.hide_output}" show_visualization="{opts.competition.enable_detailed_results}" submission="{selected_submission}"></submission-modal> </div> <div if="{!!selected_submission && _.get(selected_submission, \'has_children\', false)}"> <div class="ui large green pointing menu"> <div each="{child, i in _.get(selected_submission, \'children\')}" class="parent-modal item" data-tab="{admin_: is_admin()}child_{i}"> Task {i + 1} </div> <div if="{is_admin()}" data-tab="admin" class="parent-modal item">Admin</div> <div class="item" if="{_.get(selected_submission, \'children\').length === 0}"> <i style="padding: 5px;">ERROR: Submission is a parent, but has no children. There was an error during creation.</i> </div> </div> <div each="{child, i in _.get(selected_submission, \'children\')}" class="ui tab" data-tab="{admin_: is_admin()}child_{i}"> <submission-modal hide_output="{selected_phase.hide_output}" show_visualization="{opts.competition.enable_detailed_results}" submission="{child}"></submission-modal> </div> <div class="ui tab" style="height: 565px; overflow: auto;" data-tab="admin" if="{is_admin()}"> <submission-scores leaderboards="{leaderboards}"></submission-scores> </div> </div> </div> </div>', 'submission-manager,[data-is="submission-manager"]{ display: block; margin: 2em 0; min-height: 90vh; } submission-manager .admin-buttons,[data-is="submission-manager"] .admin-buttons{ padding-bottom: 20px; } submission-manager .on-leaderboard:hover,[data-is="submission-manager"] .on-leaderboard:hover{ cursor: auto; background-color: #21ba45 !important; } submission-manager .submission_row,[data-is="submission-manager"] .submission_row{ height: 52px; } submission-manager .submission_row:hover,[data-is="submission-manager"] .submission_row:hover{ cursor: pointer; } submission-manager table tbody .center.aligned td,[data-is="submission-manager"] table tbody .center.aligned td{ color: #8c8c8c; } submission-manager .failed.question.circle.icon,[data-is="submission-manager"] .failed.question.circle.icon{ color: #2c3f4c; } submission-manager .checkbox-label,[data-is="submission-manager"] .checkbox-label{ margin-left: 5px; } submission-manager .soft-deleted,[data-is="submission-manager"] .soft-deleted{ background-color: #ffdede !important; }', 'class="submission-manager"', function(opts) {
        var self = this

        self.selected_phase = undefined
        self.selected_submission = undefined
        self.hide_output = false
        self.leaderboards = {}
        self.loading = true
        self.checked_submissions = []
        self.show_is_soft_deleted = false

        self.on("mount", function () {
            $(self.refs.search).dropdown()
            $(self.refs.status).dropdown()
            $(self.refs.phase).dropdown()
            $(self.refs.rerun_button).dropdown()
            $(self.refs.submission_handling_operation).dropdown()
            $(self.refs.submission_table).tablesort()
        })

        self.pretty_date = function (date_string) {
            if (!!date_string) {
                return luxon.DateTime.fromISO(date_string).toFormat('yyyy-MM-dd HH:mm')
            } else {
                return ''
            }
        }

        self.is_admin = () => {
            return _.get(self.selected_submission, 'admin', false)
        }

        self.do_nothing = event => {
            event.stopPropagation()
        }

        self.filter_children = submissions => {
            return _.filter(submissions, sub => !sub.parent)
        }

        self.toggleShowSoftDeleted = function () {
            self.show_is_soft_deleted = !self.show_is_soft_deleted
            self.update_submissions()
            self.update()
        }

        self.update_submissions = function (filters) {
            self.loading = true
            self.update()
            if (opts.admin) {
                filters = filters || { phase__competition: opts.competition.id }
                filters.show_is_soft_deleted = self.show_is_soft_deleted
            } else {
                filters = filters || { phase: self.selected_phase.id }
            }
            filters = filters || { phase: self.selected_phase.id }
            CODALAB.api.get_submissions(filters)
                .done(function (submissions) {

                    if (opts.admin) {
                        self.submissions = submissions.map((item) => {
                            item.phase = opts.competition.phases.filter((phase) => {
                                return phase.id === item.phase
                            })[0]
                            return item
                        })
                    } else {
                        self.submissions = _.filter(submissions, sub => sub.owner === CODALAB.state.user.username)
                    }
                    if (!opts.admin) {
                        CODALAB.events.trigger('submissions_loaded', self.submissions)
                    }
                    self.csv_link = CODALAB.api.get_submission_csv_URL(filters)
                    self.update()
                    self.submission_checked()

                    _.delay(() => {
                        self.loading = false
                        self.update()
                    }, 300)
                })
                .fail(function (response) {
                    toastr.error("Error retrieving submissions")
                })
        }

        self.add_to_leaderboard = function (submission) {
            CODALAB.api.add_submission_to_leaderboard(submission.id)
                .done(function (data) {
                    self.update_submissions()
                    CODALAB.events.trigger('submission_changed_on_leaderboard')
                })
                .fail(function (response) {
                    toastr.error(response.responseJSON.detail)
                })
            event.stopPropagation()
        }
        self.remove_from_leaderboard = function (submission) {
            CODALAB.api.remove_submission_from_leaderboard(submission.id)
                .done(function (data) {
                    self.update_submissions()
                    CODALAB.events.trigger('submission_changed_on_leaderboard')
                })
                .fail(function (response) {
                    toastr.error(response.responseJSON.detail)
                })
            event.stopPropagation()
        }
        self.rerun_phase = function (phase) {
            if (confirm("Are you sure? This could take hours .. you are re-running all of the submissions in a phase.")) {
                CODALAB.api.re_run_phase_submissions(phase.id)
                    .done(function (response) {
                        toastr.success(`Rerunning ${response.count} submissions`)
                        self.update_submissions()
                    })
                    .fail(function (response) {
                        toastr.error(response.responseJSON.detail)
                    })
            }
        }
        self.filter = function () {
            delay(() => {
                var filters = {}
                var search = self.refs.search.value
                if (search) {
                    filters['search'] = search
                }
                var status = self.refs.status.value
                if (status !== ' ') {
                    filters['status'] = status
                }
                if (!opts.admin) {
                    filters['phase'] = self.selected_phase.id
                } else {
                    var phase = self.refs.phase.value
                    if (phase && phase !== ' ') {
                        filters['phase'] = phase
                    } else {
                        filters['phase__competition'] = opts.competition.id
                    }
                }
                self.update_submissions(filters)
            }, 100)
        }

        self.run_submission = function (submission) {
            CODALAB.api.run_submission(submission.id)
                .done(function (response) {
                    toastr.success('Submission queued')
                    self.update_submissions()
                })
                .fail(function (response) {
                    if (response.responseJSON.detail) {
                        toastr.error(response.responseJSON.detail)
                    } else {
                        toastr.error(response.responseText)
                    }
                })
            event.stopPropagation()

        }

        self.rerun_submission = function (submission) {
            CODALAB.api.re_run_submission(submission.id)
                .done(function (response) {
                    toastr.success('Submission queued')
                    self.update_submissions()
                })
                .fail(function (response) {
                    if (response.responseJSON.detail) {
                        toastr.error(response.responseJSON.detail)
                    }
                    else if (response.responseJSON.error_msg) {
                        toastr.error(response.responseJSON.error_msg)
                    }
                    else {
                        toastr.error(response.responseText)
                    }
                })
            event.stopPropagation()
        }

        self.rerun_selected_submissions = function () {
            CODALAB.api.re_run_many_submissions(self.checked_submissions)
                .done(function (response) {
                    toastr.success('Submissions queued')
                    self.update_submissions()
                })
        }

        self.cancel_submission = function (submission) {
            CODALAB.api.cancel_submission(submission.id)
                .done(function (response) {
                    if (response.canceled === true) {
                        toastr.success('Submission cancelled')
                        self.update_submissions()
                    } else {
                        toastr.error('Could not cancel submission')
                    }
                })
            event.stopPropagation()
        }

        self.delete_submission = function (submission) {
            if (confirm(`Are you sure you want to delete submission: ${submission.filename}?`)) {
                CODALAB.api.delete_submission(submission.id)
                    .done(function (response) {
                        toastr.success('Submission deleted')
                        self.update_submissions()
                    })
            }
            event.stopPropagation()
        }

        self.soft_delete_submission = function (submission) {
            if (confirm(`Are you sure you want to delete your submission: ${submission.filename}?`)) {
                CODALAB.api.soft_delete_submission(submission.id)
                    .done(function (response) {
                        toastr.success(response.message || 'Submission deleted successfully');
                        self.update_submissions()
                    })
                    .fail(function (response) {
                        let errorMsg = 'An error occurred while deleting the submission.';
                        if (response.responseJSON && response.responseJSON.error) {
                            errorMsg = response.responseJSON.error;
                        }
                        toastr.error(errorMsg)
                    })
            }
            event.stopPropagation()
        }

        self.delete_selected_submissions = function () {
            if (confirm(`Are you sure you want to delete the selected submissions?`)) {
                CODALAB.api.delete_many_submissions(self.checked_submissions)
                    .done(function (response) {
                        toastr.success('Submissions deleted')
                        self.update_submissions()
                    })
                    .fail(function (response) {
                        toastr.error('Something went wrong')
                    })
            }
        }

        self.get_score_details = function (submission, column) {
            try {
                let score = _.filter(submission.scores, (score) => {
                    return score.column_key === column.key
                })[0]
                return [score.score, score.id]
            } catch {
                return ['', '']
            }
        }

        self.get_score = function (submission) {
            try {
                return parseFloat(submission.scores[0].score).toFixed(2)

            } catch {
                return ""
            }
        }

        self.toggle_submission_is_public = function (submission) {
            event.stopPropagation()
            let message = submission.is_public
                ? 'Are you sure you want to make this submission private? It will no longer be visible to other users.'
                : 'Are you sure you want to make this submission public? It will become visible to everyone'
            if (confirm(message)) {
                CODALAB.api.toggle_submission_is_public(submission.id)
                    .done(data => {
                        toastr.success('Submission updated')
                        self.update_submissions()
                    })
                    .fail(resp => {
                        toastr.error(resp.responseJSON.detail)
                    })
            }
        }

        self.on_submission_checked = function (event) {
            event.stopPropagation()
            self.submission_checked()
        }

        self.submission_checked = function () {
            let inputs = $(self.refs.submission_table).find('input')
            let checked_boxes = inputs.not(':first').filter('input:checked')
            let unchecked_boxes = inputs.not(':first').filter('input:not(:checked)')
            inputs.first().prop('checked', unchecked_boxes.length === 0)
            self.checked_submissions = checked_boxes.serializeArray().map((x) => { return x.name })
        }

        self.select_all_pressed = function () {
            let check_boxes = $(self.refs.submission_table).find('input')

            check_boxes.prop('checked', check_boxes.first().is(':checked'))

            let inputs = $(self.refs.submission_table).find('input')
            let checked_boxes = inputs.not(':first').filter('input:checked')
            self.checked_submissions = checked_boxes.serializeArray().map((x) => { return x.name })
        }

        self.submission_clicked = function (submission) {

            submission = _.defaultsDeep({}, submission)
            if (submission.has_children) {
                submission.children = _.map(_.sortBy(submission.children), child => {
                    return { id: child }
                })
                CODALAB.api.get_submission_details(submission.id)
                    .done(function (data) {
                        self.leaderboards = data.leaderboards
                        _.forEach(self.leaderboards, (leaderboard) => {
                            _.map(leaderboard.columns, column => {
                                let [score, score_id] = self.get_score_details(submission, column)
                                column.score = score
                                column.score_id = score_id
                                return column
                            })
                        })
                        self.update()
                    })
            }
            if (opts.admin) {
                submission.admin = true
            }
            self.selected_submission = submission
            self.update()
            $(self.refs.modal)
                .modal({
                    onShow: () => {
                        if (_.get(self.selected_submission, 'has_children', false)) {

                            let path = self.is_admin() ? 'admin_child_0' : 'child_0'
                            $('.menu .parent-modal.item')
                                .tab('change tab', path)
                        }
                    }
                })
                .modal('show')
            CODALAB.events.trigger('submission_clicked')
        }

        self.bulk_download = function () {
            CODALAB.api.download_many_submissions(self.checked_submissions)
            .catch(function (error) {
                console.error('Error:', error);
            });
        }

        self.submission_handling = function () {

            if (self.checked_submissions.length === 0) {
                console.log("no submission is selected");
            } else {
                var submission_operation = self.refs.submission_handling_operation.value
                switch (submission_operation) {
                    case "delete":

                        self.delete_selected_submissions()
                        break;
                    case "download":

                        self.bulk_download()
                        break;
                    case "rerun":

                        self.rerun_selected_submissions()
                        break
                    default:
                        console.log("should never be in this state of default..")
                }
            }
        }

        CODALAB.events.on('phase_selected', function (selected_phase) {
            self.selected_phase = selected_phase
            self.selected_phase.hide_output = selected_phase.hide_output && !CODALAB.state.user.has_competition_admin_privileges(self.opts.competition)
            self.update_submissions()
        })

        CODALAB.events.on('new_submission_created', function (new_submission_data) {
            self.submissions.unshift(new_submission_data)
            self.update()
        })

        CODALAB.events.on('score_updated', () => {
            $(self.refs.modal).modal('hide')
            self.update_submissions()
        })

        CODALAB.events.on('submission_status_update', data => {
            let sub = _.find(self.submissions, submission => submission.id === data.submission_id)
            if (sub) {
                sub.status = data.status
            }
            self.update()
        })
});

riot.tag2('submission-modal', '<div class="ui large green pointing menu"> <div class="active submission-modal item" data-tab="{admin_: submission.admin}downloads">DOWNLOADS</div> <div class="submission-modal item" data-tab="{admin_: submission.admin}logs" show="{!opts.hide_output}">LOGS</div> <div class="submission-modal item" data-tab="{admin_: submission.admin}graph" show="{!opts.hide_output && opts.show_visualization}">VISUALIZATION</div> <div class="submission-modal item" data-tab="admin" if="{submission.admin}">ADMIN</div> <div class="submission-modal item" data-tab="{admin_: submission.admin}fact_sheet">FACT SHEET ANSWERS</div> </div> <div class="ui tab active modal-tab" data-tab="{admin_: submission.admin}downloads"> <div class="ui relaxed centered grid"> <div class="ui fifteen wide column"> <table class="ui table" id="downloads"> <thead> <tr> <th><i class="download icon"></i> Files</th> </tr> </thead> <tbody> <tr> <td class="selectable file-download"> <a href="{data_file}"><i class="file archive outline icon"></i> Submission File</a> </td> </tr> <tr> <td class="selectable file-download {disabled: !prediction_result}" show="{!opts.hide_prediction_output}"> <a href="{prediction_result}"><i class="file outline icon"></i>Output from prediction step</a> </td> </tr> <tr> <td class="selectable file-download {disabled: !scoring_result}" show="{!opts.hide_score_output}"> <a href="{scoring_result}"><i class="file outline icon"></i>Output from scoring step</a> </td> </tr> </tbody> </table> </div> </div> </div> <div class="ui tab modal-tab" data-tab="{admin_: submission.admin}logs" hide="{opts.hide_output}"> <div class="ui grid"> <div class="three wide column"> <div class="ui fluid vertical secondary menu"> <div class="active submission-modal item" data-tab="{admin_: submission.admin}prediction"> Prediction Logs </div> <div class="submission-modal item" data-tab="{admin_: submission.admin}scoring"> Scoring Logs </div> </div> </div> <div class="thirteen wide column"> <div class="ui active tab" data-tab="{admin_: submission.admin}prediction"> <div class="ui top attached inverted pointing menu"> <div class="active submission-modal item" data-tab="{admin_: submission.admin}p_stdout"> stdout </div> <div class="submission-modal item" data-tab="{admin_: submission.admin}p_stderr"> stderr </div> <div class="submission-modal item" data-tab="{admin_: submission.admin}p_ingest_stdout"> Ingestion stdout </div> <div class="submission-modal item" data-tab="{admin_: submission.admin}p_ingest_stderr"> Ingestion stderr </div> </div> <div class="ui active bottom attached inverted segment tab log" data-tab="{admin_: submission.admin}p_stdout"> <pre>{logs.prediction_stdout}</pre> </div> <div class="ui bottom attached inverted segment tab log" data-tab="{admin_: submission.admin}p_stderr"> <pre>{logs.prediction_stderr}</pre> </div> <div class="ui bottom attached inverted segment tab log" data-tab="{admin_: submission.admin}p_ingest_stdout"> <pre>{logs.prediction_ingestion_stdout}</pre> </div> <div class="ui bottom attached inverted segment tab log" data-tab="{admin_: submission.admin}p_ingest_stderr"> <pre>{logs.prediction_ingestion_stderr}</pre> </div> </div> <div class="ui tab" data-tab="{admin_: submission.admin}scoring"> <div class="ui top attached inverted pointing menu"> <div class="active submission-modal item" data-tab="{admin_: submission.admin}s_stdout"> stdout </div> <div class="submission-modal item" data-tab="{admin_: submission.admin}s_stderr"> stderr </div> <div class="submission-modal item" data-tab="{admin_: submission.admin}s_ingest_stdout"> Ingestion stdout </div> <div class="submission-modal item" data-tab="{admin_: submission.admin}s_ingest_stderr"> Ingestion stderr </div> </div> <div class="ui active bottom attached inverted segment tab log" data-tab="{admin_: submission.admin}s_stdout"> <pre>{logs.scoring_stdout}</pre> </div> <div class="ui bottom attached inverted segment tab log" data-tab="{admin_: submission.admin}s_stderr"> <pre>{logs.scoring_stderr}</pre> </div> <div class="ui bottom attached inverted segment tab log" data-tab="{admin_: submission.admin}s_ingest_stdout"> <pre>{logs.scoring_ingestion_stdout}</pre> </div> <div class="ui bottom attached inverted segment tab log" data-tab="{admin_: submission.admin}s_ingest_stderr"> <pre>{logs.scoring_ingestion_stderr}</pre> </div> </div> </div> </div> </div> <div class="ui tab modal-tab" data-tab="{admin_: submission.admin}fact_sheet"> <div class="ui inverted segment log"> <textarea name="fact-sheet" id="fact_sheet" ref="fact_sheet_text_area">{JSON.stringify(fact_sheet_answers, null, 2)}</textarea> </div> <div class="ui button green" onclick="{update_fact_sheet.bind(this)}">Save</div> </div> <div class="ui tab modal-tab" data-tab="{admin_: submission.admin}graph" show="{opts.show_visualization && (!opts.hide_output || submission.admin)}"> <iframe riot-src="{detailed_result}" class="graph-frame" show="{detailed_result}"></iframe> </div> <div class="ui tab leaderboard-tab" data-tab="admin" if="{submission.admin}"> <submission-scores leaderboards="{leaderboards}"></submission-scores> </div>', 'submission-modal .log,[data-is="submission-modal"] .log{ height: 465px; max-height: 465px; overflow: auto; } submission-modal .leaderboard-tab,[data-is="submission-modal"] .leaderboard-tab{ height: 515px; overflow: auto; } submission-modal .modal-tab,[data-is="submission-modal"] .modal-tab{ height: 530px; } submission-modal .file-download,[data-is="submission-modal"] .file-download{ margin-top: 25px !important; margin-botton: 25px !important; } submission-modal .graph-frame,[data-is="submission-modal"] .graph-frame{ height: 100%; width: 100%; overflow: scroll; border: none; } submission-modal #downloads thead tr th,[data-is="submission-modal"] #downloads thead tr th,submission-modal #downloads tbody tr td,[data-is="submission-modal"] #downloads tbody tr td{ font-size: 16px !important; } submission-modal .inverted,[data-is="submission-modal"] .inverted,submission-modal textarea,[data-is="submission-modal"] textarea{ color: #fff; background: #1b1c1d; width: 100%; height: 98%; }', '', function(opts) {
        var self = this
        self.submission = {}
        self.logs = {}
        self.leaderboards = []
        self.columns = []

        self.get_score_details = function (column) {
            try {
                let score = _.filter(self.submission.scores, (score) => {
                    return score.column_key === column.key
                })[0]
                return [score.score, score.id]
            } catch {
                return ['', '']
            }
        }
        self.update_submission_details = () => {
            CODALAB.api.get_submission_details(self.submission.id)
                .done(function (data) {
                    self.leaderboards = data.leaderboards
                    self.prediction_result = data.prediction_result
                    self.scoring_result = data.scoring_result
                    self.data_file = data.data_file
                    self.detailed_result = data.detailed_result
                    self.fact_sheet_answers = data.fact_sheet_answers

                    _.forEach(data.logs, (item) => {
                        $.get(item.data_file)
                            .done(function (content) {
                                self.logs[item.name] = content
                                self.update()
                            })
                    })
                    if (self.submission.admin) {
                        _.forEach(data.leaderboards, (leaderboard) => {
                            _.map(leaderboard.columns, (column) => {
                                let [score, score_id] = self.get_score_details(column)
                                column.score = score
                                column.score_id = score_id
                                return column
                            })
                        })
                    }
                    self.update()
                })
        }

        self.update_fact_sheet = () => {
            let fact_sheet = self.refs.fact_sheet_text_area.value
            try {
                fact_sheet = JSON.parse(fact_sheet)
            }
            catch (err) {
                toastr.error("Invalid JSON")
                return false
            }
            self.fact_sheet_answers = fact_sheet
            CODALAB.api.update_submission_fact_sheet(self.submission.id, self.fact_sheet_answers)
                .done((data) => {
                    toastr.success('Fact Sheet Answers updated')
                    setTimeout(function () {
                        location.reload()
                    }, 1000)
                })
                .fail((response) => {
                    toastr.error(response.responseText)
                })
        }

        CODALAB.events.on('submission_clicked', () => {
            self.submission = opts.submission
            self.update()
            self.update_submission_details()
            let path = self.submission.admin ? 'admin_downloads' : 'downloads'
            $('.menu .submission-modal.item').tab('change tab', path)
        })
});

riot.tag2('submission-scores', '<form class="ui form" id="score_update_form"> <div each="{leaderboard in leaderboards}" class="leaderboard"> <h3>{leaderboard.title}</h3> <table class="ui collapsing table"> <thead> <tr> <th each="{column in leaderboard.columns}"> {column.title} </th> </tr> </thead> <tbody> <tr> <td each="{column in leaderboard.columns}"> <input name="{column.score_id}" disabled="{!!column.computation}" riot-value="{column.score}" step="any" type="{\'number\'}"> </td> </tr> </tbody> </table> </div> <button class="ui blue button" onclick="{update_scores}"> Submit </button> </form>', 'submission-scores .leaderboard,[data-is="submission-scores"] .leaderboard{ padding-bottom: 10px; }', '', function(opts) {
        let self = this

        self.on('update', () => {
            self.leaderboards = opts.leaderboards
        })

        self.update_scores = function (event) {
            event.preventDefault()
            let data = get_form_data($('#score_update_form', self.root))
            _.forEach(_.keys(data), (key) => {
                CODALAB.api.update_submission_score(key, {score: data[key]})
                    .done(function (data) {
                        toastr.success('Score updated')
                        CODALAB.events.trigger('score_updated')
                    })
            })
        }
});

riot.tag2('submission-upload', '<div class="ui sixteen wide column submission-container"> <div class="submission-form"> <h1>Submission upload</h1> <div if="{_.get(selected_phase, \'status\') === \'Previous\'}" class="ui red message">This phase has ended and no longer accepts submissions!</div> <div if="{_.get(selected_phase, \'status\') === \'Next\'}" class="ui yellow message">This phase hasn\'t started yet!</div> <form class="ui form coda-animated {error: errors}" ref="form" enctype="multipart/form-data"> <div class="submission-form" ref="fact_sheet_form" if="{opts.fact_sheet !== null}"> <h2>Metadata or Fact Sheet</h2> <div class="submission-form-question" each="{question in opts.fact_sheet}"> <span if="{question.type === \'text\'}"> <label if="{question.is_required == \'true\'}" class="required-answer" for="{question.key}">{question.title}:</label> <label if="{question.is_required == \'false\'}" for="{question.key}">{question.title}:</label> <input type="text" name="{question.key}"> </span> <span if="{question.type === \'checkbox\'}"> <label for="{question.key}">{question.title}:</label> <input type="hidden" name="{question.key}" value="false"> <input type="checkbox" name="{question.key}" value="true"> </span> <span if="{question.type == \'select\'}"> <label for="{question.key}">{question.title}:</label> <select name="{question.key}"> <option each="{selection_opt in question.selection}" riot-value="{selection_opt}">{selection_opt}</option> </select> </span> </div> </div> <div class="ui vertical accordion menu" style="width: 36%;" id="select_tasks_accordion" if="{selected_tasks}" hide="{selected_tasks.length < 2}"> <div class="item"> <a class="title"> <i class="dropdown icon"></i> Selected Tasks </a> <div class="content"> <div class="ui form"> <div class="grouped fields"> <div each="{task in selected_tasks}" class="field"> <div class="ui checkbox"> <input type="checkbox" name="task-{task.id}" id="task-{task.id}" checked> <label for="task-{task.id}">{task.name}</label> </div> </div> </div> </div> </div> </div> </div> <div class="ui six wide field"> <label>Submit as: <span class="ui mini circular icon button" data-tooltip="You can either submit as yourself or as an organization" data-position="top center"> <i class="question icon"></i> </span> </label> <select name="organizations" id="organization_dropdown" class="ui dropdown"> <option value="None">Yourself</option> <option each="{org in organizations}" riot-value="{org.id}">{org.name}</option> <option if="{_.size(organizations) === 0}" value="add_organization">+ Add New Organization</option> </select> </div> <input-file name="data_file" ref="data_file" error="{errors.data_file}" accept=".zip"></input-file> </form> </div> <div class="ui indicating progress" ref="progress"> <div class="bar"> <div class="progress">{upload_progress}%</div> </div> </div> <div class="ui styled fluid accordion submission-output-container {hidden: _.isEmpty(selected_submission) || selected_phase.hide_output || _.isEmpty(selected_submission.filename)}" ref="accordion"> <div class="title"> <i class="dropdown icon"></i> Running {selected_submission.filename} (ID = {selected_submission.id}) </div> <div class="ui basic segment"> <div class="content"> <div id="submission-output" class="ui" ref="submission-output"> <div class="header">Output</div> <div class="content"> <div if="{!ingestion_during_scoring}"> <div if="{_.isEmpty(children)}"> <log_window lines="{lines[selected_submission.id]}" data="{datasets[selected_submission.id]}" ref="submission_output" detailed_result_url="{detailed_result_urls[selected_submission.id]}" show_graph="{opts.competition.enable_detailed_results}"></log_window> <div class="ui checkbox" ref="autoscroll_checkbox"> <input type="checkbox" checked> <label>Autoscroll Output</label> </div> </div> <div if="{children}"> <div class="ui secondary menu submission-tabs"> <div each="{child, index in children}" class="item {active: index === 0}" data-tab="child{child}_tab"> Submission ID: {child} </div> </div> <div each="{child, index in children}" class="ui tab {active: index === 0}" data-tab="child{child}_tab"> <log_window lines="{lines[child]}" data="{datasets[child]}" detailed_result_url="{detailed_result_urls[child]}" show_graph="{opts.competition.enable_detailed_results}"> </log_window> </div> </div> </div> <div if="{ingestion_during_scoring}"> <div if="{_.isEmpty(children)}"> <log_window lines="{lines[selected_submission.id]}" data="{datasets[selected_submission.id]}" split_logs="{true}" detailed_result_url="{detailed_result_urls[selected_submission.id]}" show_graph="{opts.competition.enable_detailed_results}"></log_window> </div> <div if="{children}"> <div class="ui secondary menu"> <div each="{child, index in children}" class="item {active: index === 0}" data-tab="child{child}_tab"> Submission ID: {child} </div> </div> <div each="{child, index in children}" class="ui tab {active: index === 0}" data-tab="child{child}_tab"> <log_window lines="{lines[child]}" data="{datasets[child]}" split_logs="{true}" detailed_result_url="{detailed_result_urls[child]}" show_graph="{opts.competition.enable_detailed_results}"></log_window> </div> </div> </div> </div> </div> </div> </div> </div> </div>', 'submission-upload,[data-is="submission-upload"]{ display: block; width: 100%; height: 100%; margin-bottom: 15px; } submission-upload .required-answer::after,[data-is="submission-upload"] .required-answer::after{ margin: -0.2em 0 0 0.2em; content: \'*\'; color: #db2828; } submission-upload .submission-form,[data-is="submission-upload"] .submission-form{ background-color: #fff; padding: 2em; margin: 0, -2.9em; border: solid 1px rgba(220,220,220,0.863); margin-bottom: 2em; } submission-upload .submission-form-question,[data-is="submission-upload"] .submission-form-question{ padding: 0.66em 2em; } submission-upload .submission-form-question label,[data-is="submission-upload"] .submission-form-question label{ font-size: 16px; font-weight: 600; } submission-upload #submission-output .submission-tabs,[data-is="submission-upload"] #submission-output .submission-tabs{ overflow-x: scroll; padding-bottom: 10px; } submission-upload #submission-output .submission-tabs .item,[data-is="submission-upload"] #submission-output .submission-tabs .item{ border: solid 1px #efefef; cursor: pointer; } submission-upload #submission-output .submission-tabs .item:hover,[data-is="submission-upload"] #submission-output .submission-tabs .item:hover{ background-color: #f5f5f5; } submission-upload #submission-output .submission-tabs .item.active,[data-is="submission-upload"] #submission-output .submission-tabs .item.active{ border: solid 1px rgba(3,187,187,0.678); } submission-upload code,[data-is="submission-upload"] code{ background: #d1dffa; } submission-upload .submission-container,[data-is="submission-upload"] .submission-container{ margin-top: 1em; } submission-upload .hidden,[data-is="submission-upload"] .hidden{ display: none; } submission-upload .submission-output-container,[data-is="submission-upload"] .submission-output-container{ margin-top: 15px; } submission-upload .submission-output-container .ui.basic.segment,[data-is="submission-upload"] .submission-output-container .ui.basic.segment{ min-height: 300px; display: none; overflow-y: auto; } submission-upload .graph-container,[data-is="submission-upload"] .graph-container{ display: block; height: 250px; }', '', function(opts) {
        var self = this

        self.mixin(ProgressBarMixin)

        self.chart = undefined
        self.errors = {}
        self.lines = {}
        self.detailed_result_urls = {}
        self.selected_submission = {}
        self.status_received = false
        self.display_output = false
        self.autoscroll_selected = true
        self.ingestion_during_scoring = undefined
        self.selected_tasks = undefined

        self.children = []
        self.children_statuses = {}
        self.datasets = {}
        self.organizations = []

        self.one('mount', function () {
            CODALAB.api.get_user_participant_organizations()
                .done((data) => {
                    self.organizations = data
                    if (self.organizations.length === 0){
                        $('#organization_dropdown').hide()
                    }
                    self.update()
                })
            $('.dropdown', self.root).dropdown()
            let segment = $('.submission-output-container .ui.basic.segment')
            $('.ui.accordion', self.root).accordion({
                onOpen: () => segment.show(),
                onClose: () => segment.hide(),
            })

            $(self.refs.data_file.refs.file_input).on('change', self.check_can_upload)
            self.setup_autoscroll()
            self.setup_websocket()
        })

        $(document).on('change','#organization_dropdown',function(){
            let selected_option_value = $('#organization_dropdown option:selected').val();
            if(selected_option_value == 'add_organization'){

                window.open('/profiles/organization/create/', '_blank')
            }
        })

        self.setup_autoscroll = function () {
            if (!self.refs.autoscroll_checkbox) {
                return
            }
            $(self.refs.autoscroll_checkbox).checkbox({
                onChecked: function () {
                    self.autoscroll_selected = true;
                    self.autoscroll_output()
                },
                onUnchecked: function () {
                    self.autoscroll_selected = false;
                },
            })

            self.set_checkbox()

            $(self.refs.submission_output).scroll(function () {
                var output = self.refs.submission_output
                self.autoscroll_selected = output.scrollTop === output.scrollHeight - Math.ceil($(output).height()) - 30
                self.set_checkbox()
            })

        }
        self.setup_websocket = function () {

            self.processed_messages = new Set();

            var url = new URL('/submission_output/', window.location.href);
            url.protocol = url.protocol.replace('http', 'ws');
            var options = {
                automaticOpen: false,
                maxReconnectAttempts: 10,
                reconnectInterval: 1000
            }
            self.ws = new ReconnectingWebSocket(url, null, options)
            self.ws.addEventListener("message", function (event) {
                self.autoscroll_output()
                let event_data = JSON.parse(event.data)

                const msg_signature = `${event_data.type}-${event_data.submission_id}-${JSON.stringify(event_data.data)}`;

                if (self.processed_messages.has(msg_signature)) {
                    console.log("Skipping duplicate message:", msg_signature);
                    return;
                }

                self.processed_messages.add(msg_signature);
                switch (event_data.type) {
                    case 'catchup':
                        let detailed_result_url = ''
                        _.forEach(_.compact(event_data.data.split('\n')), data => {
                            data = JSON.parse(data)
                            if (data.kind === 'detailed_result_update') {
                                detailed_result_url = data.result_url
                            } else {
                                self.handle_websocket(event_data.submission_id, data)
                            }
                        })
                        self.detailed_result_urls[submission_id] = detailed_result_url
                        self.update()
                        break
                    case 'message':
                        self.handle_websocket(event_data.submission_id, event_data.data)
                        break
                }
            })
            self.ws.addEventListener("open", function(event){
                console.log("WebSocket connected");

                self.pull_logs()
            })
            self.ws.addEventListener("close", function(event) {
                console.log("WebSocket disconnected, reconnecting...");
            })
            self.ws.addEventListener("error", function(event) {
                console.error("WebSocket error:", event);
            })
            self.ws.open()
        }

        self.handle_websocket = function (submission_id, data) {
            submission_id = _.toNumber(submission_id)
            if (self.selected_submission.id !== submission_id && !_.includes(self.children, submission_id)) {

                return
            }
            let done_states = ['Finished', 'Cancelled', 'Unknown', 'Failed']
            let message = data.message
            let kind = data.kind
            if (kind === 'status_update') {
                if (submission_id !== self.selected_submission.id) {
                    self.children_statuses[submission_id] = data.status
                    if (_.every(self.children, child => _.includes(done_states, self.children_statuses[child]))) {
                        CODALAB.events.trigger('submission_status_update', {
                            submission_id: self.selected_submission.id,
                            status: 'Finished'
                        })
                    }
                }
                self.status_received = true
                CODALAB.events.trigger('submission_status_update', {submission_id: submission_id, status: data.status})
            } else if (kind === 'child_update') {
                self.children.push(data.child_id)
                self.update()
                $('.menu .item', self.root).tab()
            } else if (kind === 'detailed_result_update') {
                self.detailed_result_urls[submission_id] = data.result_url
                self.update()
            } else {
                try {
                    message = JSON.parse(message);
                    if (message.type === "plot") {
                        self.add_graph_data_point(submission_id, message.value)
                    } else if (message.type === "message") {
                        self.add_line(submission_id, kind, message.message)
                    }
                } catch (e) {

                    self.add_line(submission_id, kind, message)
                }
            }
        }

        self.pull_logs = function () {
            if (_.isEmpty(self.lines) && !_.isEmpty(self.selected_submission)) {
                self.ws.send(JSON.stringify({
                    submission_ids: _.concat(self.selected_submission.id, _.get(self.selected_submission, 'children', []))
                }))
            }
        }

        self.set_checkbox = function () {
            $(self.refs.autoscroll_checkbox).children('input').prop('checked', self.autoscroll_selected)
        }

        self.add_graph_data_point = function (submission_id, value) {
            if (!self.datasets[submission_id]) {
                self.datasets[submission_id] = {
                    label: submission_id,
                    data: [],
                    steppedLine: true,
                    backgroundColor: 'rgba(0,187,187,0.3)',
                    pointBackgroundColor: 'rgba(0,187,187,0.8)',
                    borderColor: 'rgba(0,187,187,0.8)',
                    fill: true,
                }
            }

            self.datasets[submission_id].data.push({x: value[0], y: value[1]})
        }

        self.add_line = function (submission_id, kind, message) {
            if (message === undefined) {
                message = '\n'
            }

            if (self.ingestion_during_scoring) {
                try {
                    self.lines[submission_id][kind].push(message)
                } catch (e) {
                    _.set(self.lines, `${submission_id}.${kind}`, [message])
                }
            } else {
                try {
                    self.lines[submission_id].push(message)
                } catch (e) {
                    self.lines[submission_id] = [message]
                }
            }
            self.update()
            self.autoscroll_output()
        }

        self.clear_form = function () {
            $('input-file[ref="data_file"]').find("input").val('')
            self.errors = {}
            self.update()
        }

        self.set_difference = function (setA, setB) {
            let difference = new Set(setA)
            for (ele of setB){
                difference.delete(ele)
            }
            return difference
        }

        self.check_can_upload = function () {

            if(self.selected_phase.status === "Current"){

                CODALAB.api.can_make_submissions(self.selected_phase.id)
                    .done(function (data) {
                        if (data.can) {
                            self.prepare_upload(self.upload)()
                        } else {
                            toastr.error(data.reason)
                        }
                    })
                    .fail(function (data) {
                        toastr.error('Could not verify your ability to make a submission')
                    })
            }else{

                if(self.selected_phase.status === "Next"){
                    toastr.error('This phase has not started yet. Please check the phase start date!')

                }
                if(self.selected_phase.status === "Previous"){
                    toastr.error('This phase has ended and no longer accepts submissions!')
                }
                self.clear_form()
            }
        }

        self.get_fact_sheet_answers = function () {
            let form_array = $(self.refs.form).serializeArray()
            let form_json = {}
            for (answer of form_array) {
                if(!answer['name'].startsWith('task-')){
                    if(answer['value'] === 'true'){
                        form_json[answer['name']] = true
                    }
                    else if(answer['value'] === 'false'){
                        form_json[answer['name']] = false
                    } else {
                    form_json[answer['name']] = answer['value'].trim()
                    }
                }
            }
            return form_json === {} ? null : form_json
        }

        self.upload = function () {
            self.display_output = true

            let checkbox_answers = $('#select_tasks_accordion').find('.ui.checkbox').checkbox('is checked')
            let task_ids_to_run = []
            if(self.selected_tasks.length > 1){
                for(let i = 0; i < self.selected_tasks.length; i++){
                    if(checkbox_answers[i]){
                        task_ids_to_run.push(self.selected_tasks[i].id)
                    }
                }
            } else if(self.selected_tasks.length === 1){
                task_ids_to_run = [self.selected_tasks[0].id]
            }
            var data_file_metadata = {
                type: 'submission',
                competition: self.opts.competition.id
            }
            var data_file = self.refs.data_file.refs.file_input.files[0]
            self.children = []
            self.children_statuses = {}
            CODALAB.api.create_dataset(data_file_metadata, data_file, self.file_upload_progress_handler)
                .done(function (data) {
                    self.lines = {}
                    let dropdown = $('#organization_dropdown')
                    let organization = dropdown.dropdown('get value')
                    if(organization === 'add_organization' | organization === 'None'){
                        organization = null
                    }
                    dropdown.attr('disabled', 'disabled')

                    CODALAB.api.create_submission({
                        "data": data.key,
                        "phase": self.selected_phase.id,
                        "fact_sheet_answers": self.get_fact_sheet_answers(),
                        "tasks": task_ids_to_run,
                        "organization": organization,
                        "queue": self.opts.competition.queue ? self.opts.competition.queue.id : null
                    })
                        .done(function (data) {
                            CODALAB.events.trigger('new_submission_created', data)
                            CODALAB.events.trigger('submission_selected', data)
                            $('#organization_dropdown').removeAttr('disabled')
                        })
                        .fail(function (response) {
                            try {
                                let errors = JSON.parse(response.responseText)
                                let error_str = Object.keys( errors ).map(function (key) { return errors[key] }).join("; ")
                                toastr.error("Submission Failed: ".concat(error_str))
                            } catch (e) {
                                toastr.error("Submission Failed")
                            }
                        })
                })
                .fail(function (response) {
                    if (response) {
                        try {
                            let errors = JSON.parse(response.responseText)
                            let error_str = Object.keys(errors).map(function (key) { return errors[key] }).join("; ")
                            toastr.error("Submission upload failed: " + error_str)
                            self.update({errors: errors})

                        } catch (e) {
                            toastr.error("Submission upload failed. Server returned: " + response.status + " " + response.statusText);
                        }
                    } else {
                        toastr.error("Something went wrong, please try again later")
                    }

                })
                .always(function () {
                    setTimeout(self.hide_progress_bar, 500)
                    self.clear_form()
                })
        }

        CODALAB.events.on('phase_selected', function (selected_phase) {
            self.selected_phase = selected_phase
            self.selected_tasks = self.selected_phase.tasks.map(task => task)
            self.ingestion_during_scoring = _.some(selected_phase.tasks, t => t.ingestion_only_during_scoring)
            self.update()
            $('.ui.accordion').accordion('refresh');
        })

        CODALAB.events.on('submissions_loaded', submissions => {
            let latest_submission = _.head(_.filter(submissions, {parent: null}))
            if (latest_submission && !_.includes(['Finished', 'Cancelled', 'Failed', 'Unknown'], latest_submission.status)) {
                self.selected_submission = latest_submission
                self.children = _.sortBy(latest_submission.children)
                if (self.children) {
                    self.update()
                    $('.menu .item', self.root).tab()
                }

            }
        })

        CODALAB.events.on('submission_selected', function (selected_submission) {
            self.selected_submission = selected_submission
            self.autoscroll_output()
        })

        self.autoscroll_output = function () {
            if (!self.refs.autoscroll_checkbox) {
                return
            }
            if (self.autoscroll_selected) {
                var output = self.refs.submission_output
                output.scrollTop = output.scrollHeight
            }
        }
});

riot.tag2('competition-collaborators', '<div class="ui center aligned grid"> <div class="row"> <div class="fourteen wide column"> <table class="ui padded table"> <thead> <tr> <th colspan="2">Administrators</th> </tr> </thead> <tbody> <tr> <td>{created_by}</td> <td class="right aligned">Creator</td> </tr> <tr each="{collab, index in collabs}"> <td>{collab.name || collab.username}</td> <td class="right aligned"> <a class="icon-button" onclick="{remove_collaborator.bind(this, index, (collab.name || collab.username))}"> <i class="red trash alternate outline icon"></i> </a> </td> </tr> </tbody> <tfoot> <tr> <th colspan="2" class="right aligned"> <button class="ui tiny inverted green icon button" ref="modal_button"> <i class="add icon"></i> Add administrator </button> </th> </tr> </tfoot> </table> </div> </div> </div> <div class="ui mini modal" ref="modal"> <i class="close icon"></i> <div class="header"> Add collaborator </div> <div class="content"> <div class="ui message error" if="{errors != null}"> {errors} </div> <div class="ui form"> <div class="field required"> <label> Username </label> <div class="ui fluid left icon labeled input search dataset" data-name="{file-field}"> <i class="search icon"></i> <input type="text" class="prompt" ref="email"> <div class="results"></div> </div> </div> </div> </div> <div class="actions"> <div class="ui button cancel" onclick="{close_modal}">Cancel</div> <div class="ui button primary" onclick="{add_collaborator}">Add</div> </div> </div>', 'competition-collaborators .chevron,[data-is="competition-collaborators"] .chevron,competition-collaborators .icon-button,[data-is="competition-collaborators"] .icon-button{ cursor: pointer; }', '', function(opts) {
        var self = this
        self.collabs = []
        self.errors = null

        self.one("mount", function () {

            $(self.refs.modal_button).click(function () {
                $(self.refs.modal).modal('show')
            })
            $('.ui.search', self.root)
                .search({
                    apiSettings: {
                        url: `${URLS.API}user_lookup/?q={query}`,
                    },
                    preserveHTML: false,
                    minCharacters: 2,
                    fields: {
                        title: 'name',
                        value: 'id',
                    },
                    cache: false,
                    maxResults: 5,
                    onSelect: (result, response) => {
                        self.new_collab = result
                    }
                })
        })

        self.remove_collaborator = (index, name) => {
            if (confirm(`Remove ${name} as a collaborator`)) {
                self.collabs.splice(index,1)
                self.update()
            }
        }

        self.close_modal = () => {
            $(self.refs.modal).modal('hide')
            $(self.refs.email).val('')
            self.errors = null
        }
        self.add_collaborator = () => {
            if (self.new_collab) {
                if (self.new_collab.id === CODALAB.state.user.id) {
                    self.errors = "You cannot add yourself as a collaborator"
                } else if (self.new_collab.username === self.created_by) {
                    self.errors = "You cannot add the benchmark creator as a collaborator"
                } else if (_.filter(self.collabs, collab => collab.id === self.new_collab.id).length === 0) {
                    self.collabs.push(self.new_collab)
                    self.new_collab = {}
                    self.close_modal()
                } else {
                    self.errors = `${self.new_collab.name} is already a collaborator`
                }
            } else {
                self.errors = 'Username field cannot be blank'
            }
            self.update()
        }

        CODALAB.events.on('competition_loaded', function (competition) {
            self.collabs = competition.collaborators
            self.created_by = competition.created_by
            self.update()
        })
});

riot.tag2('competition-details', '<div class="ui form"> <div class="field required"> <label>Title</label> <input type="text" ref="title" onchange="{form_updated}"> </div> <div class="field required"> <label>Logo</label> <label show="{uploaded_logo}"> Uploaded Logo: <a href="{uploaded_logo}" target="_blank">{uploaded_logo_name}</a> </label> <div class="ui left action file input"> <button class="ui icon button" onclick="document.getElementById(\'form_file_logo\').click()"> <i class="attach icon"></i> </button> <input id="form_file_logo" type="file" ref="logo" accept="image/*"> <input riot-value="{logo_file_name}" readonly onclick="document.getElementById(\'form_file_logo\').click()"> </div> </div> <div class="field smaller-mde"> <label>Description</label> <textarea class="markdown-editor" ref="comp_description" name="description" onchange="{form_updated}"></textarea> </div> <div class="field"> <label>Queue</label> <select class="ui fluid search selection dropdown" ref="queue"></select> </div> <div class="field required"> <label>Competition Docker Image</label> <input type="text" ref="docker_image" placeholder="Example: codalab/codalab-legacy:py37" onchange="{form_updated}"> </div> <div class="field"> <label>Competition Type</label> <div ref="competition_type" class="ui selection dropdown"> <input type="hidden" name="competition_type" riot-value="{data.competition_type || \'competition\'}" onchange="{form_updated}"> <div class="text">Competition</div> <i class="dropdown icon"></i> <div class="menu"> <div class="item" data-value="competition">Competition</div> <div class="item" data-value="benchmark">Benchmark</div> </div> </div> </div> <div class="field"> <label>Competition Reward</label> <input type="text" ref="reward" placeholder="Example: $1000 for the top participant" onchange="{form_updated}"> </div> <div class="field"> <label>Organizer Contact Email</label> <input ref="contact_email" placeholder="Example: email@example.com" onchange="{form_updated}" type="email"> </div> <div class="field"> <label>Competition Report</label> <input type="text" ref="report" placeholder="Example: https://example.com/report.pdf" onchange="{form_updated}"> </div> <div class="field smaller-mde"> <label>Fact Sheet</label> <div class="row"> <button class="ui basic blue button" onclick="{add_question.bind(this, \'boolean\')}">Boolean +</button> <button class="ui basic blue button" onclick="{add_question.bind(this, \'text\')}">Text +</button> <button class="ui basic blue button" onclick="{add_question.bind(this, \'selection\')}">Selection +</button> </div> <br> <form ref="comp_fact_sheet"> <div class="fact-sheet-question" each="{question in fact_sheet_questions}"> <div class="row" id="q-div-{question.id}"> <p if="{question.type === \'checkbox\'}">Type: Boolean <input type="hidden" name="type-{question.id}" value="checkbox"> </p> <p if="{question.type === \'text\'}">Type: Text <input type="hidden" name="type-{question.id}" value="text"> </p> <p if="{question.type === \'select\'}">Type: Select <input type="hidden" name="type-{question.id}" value="select"> </p> <p> <label style="font-size: 1em; font-weight: 500;" for="key-{question.id}">Key name: </label> <a class="float-right" data-tooltip="Key is required for programmatic access to data. Best Practice is to have no whitespace." data-position="right center"> <i class="grey question circle icon"></i> </a> <input name="key-{question.id}" id="key-{question.id}" type="text" riot-value="{question.key}"> </p> <p if="{question.type === \'select\'}"> <label for="selection-{question.id}">Choices (Comma Separated): </label> <input name="selection-{question.id}" id="selection-{question.id}" type="text" riot-value="{question.selection.join()}"> </p> <p> <label for="is_on_leaderboard-{question.id}">Show On Leaderboard: </label> <input type="hidden" name="is_on_leaderboard-{question.id}" value="false"> <input if="{question.is_on_leaderboard === \'true\'}" type="checkbox" name="is_on_leaderboard-{question.id}" value="true" onchange="{form_updated}" checked> <input if="{question.is_on_leaderboard !== \'true\'}" type="checkbox" name="is_on_leaderboard-{question.id}" value="true" onchange="{form_updated}"> </p> <p> <label for="title-{question.id}">Display Name: </label> <a class="float-right" data-tooltip="This is what the user sees when prompted for an answer, and the category name on the leaderboard." data-position="right center"> <i class="grey question circle icon"></i> </a> <input name="title-{question.id}" id="title-{question.id}" type="text" riot-value="{question.title}"> </p> <p> <label for="is-required-{question.id}">Is Required:</label> <input type="hidden" name="is_required-{question.id}" value="false"> <input if="{question.is_required === \'true\'}" type="checkbox" name="is_required-{question.id}" value="true" onchange="{form_updated}" checked> <input if="{question.is_required !== \'true\'}" type="checkbox" name="is_required-{question.id}" value="true" onchange="{form_updated}"> </p> </div> <br> <button class="ui basic red button" onclick="{remove_question.bind(this, question.id)}">Remove</button> </div> </form> </div> <div class="field smaller-mde"> <label> Files Available <sup> <a href="https://docs.codabench.org/latest/Organizers/Benchmark_Creation/Yaml-Structure/" target="_blank" data-tooltip="What\'s this?"> <i class="grey question circle icon"></i> </a> </sup> </label> <div class="ui checkbox"> <label>Make Programs Available</label> <input type="checkbox" ref="make_programs_available" onchange="{form_updated}"> </div> <br> <div class="ui checkbox"> <label>Make Input Data Available</label> <input type="checkbox" ref="make_input_data_available" onchange="{form_updated}"> </div> </div> <div class="field"> <label>Detailed Results</label> <div class="ui checkbox"> <label>Enable Detailed Results</label> <input type="checkbox" ref="detailed_results" onchange="{form_updated}"> </div> <sup> <a href="https://docs.codabench.org/latest/Organizers/Benchmark_Creation/Detailed-Results-and-Visualizations/" target="_blank" data-tooltip="What\'s this?"> <i class="grey question circle icon"></i> </a> </sup> <br> <div class="ui checkbox"> <label>Show Detailed Results in submission pannel</label> <input type="checkbox" ref="show_detailed_results_in_submission_panel" onchange="{form_updated}"> </div> <sup> <span data-tooltip="If checked and detailed results are enabled, participants can see detailed results in submission panel" data-inverted="" data-position="bottom center"> <i class="help icon circle"></i> </span> </sup> <br> <div class="ui checkbox"> <label>Show Detailed Results in leaderboard</label> <input type="checkbox" ref="show_detailed_results_in_leaderboard" onchange="{form_updated}"> </div> <sup> <span data-tooltip="If checked and detailed results are enabled, participants can see detailed results in leaderboard" data-inverted="" data-position="bottom center"> <i class="help icon circle"></i> </span> </sup> </div> <div class="field"> <label>Submission execution</label> <div class="ui checkbox"> <label>Auto-run submissions</label> <input type="checkbox" ref="auto_run_submissions" onchange="{form_updated}"> </div> <sup> <span data-tooltip="If unchecked, organizers will have to manually run each submission" data-inverted="" data-position="bottom center"> <i class="help icon circle"></i> </span> </sup> </div> <div class="field"> <label>Public Submissions</label> <div class="ui checkbox"> <label>Participants can make submission public</label> <input type="checkbox" ref="can_participants_make_submissions_public" onchange="{form_updated}"> </div> <sup> <span data-tooltip="If unchecked, participants cannot make their submissions public from submission panel" data-inverted="" data-position="bottom center"> <i class="help icon circle"></i> </span> </sup> </div> <div class="field"> <label>Forum</label> <div class="ui checkbox"> <label>Enable Competition Forum</label> <input type="checkbox" ref="forum_enabled" onchange="{form_updated}"> </div> <sup> <span data-tooltip="If unchecked, organizers and participants cannot see competition forum" data-inverted="" data-position="bottom center"> <i class="help icon circle"></i> </span> </sup> </div> </div>', 'competition-details .fact-sheet-question,[data-is="competition-details"] .fact-sheet-question{ border: 1px solid rgba(220,220,220,0.863); background-color: #fff; padding: 1.5em; }', '', function(opts) {
        var self = this
        self.fact_sheet_questions = []

        self.data = {}
        self.is_editing_competition = false

        self.logo_file_name = ''

        self.one("mount", function () {

            $(self.refs.comp_fact_sheet).attr('placeholder', '{\n  "key": ["value1","value2",true,false]\n  "leave_blank_to_accept_any": ""\n}\n')
            self.markdown_editor = create_easyMDE(self.refs.comp_description)
            $('.ui.checkbox', self.root).checkbox({
                onChange: self.form_updated
            })

            $(self.refs.logo).change(function () {
                self.logo_file_name = self.refs.logo.value.replace(/\\/g, '/').replace(/.*\//, '')
                self.update()
                getBase64(this.files[0]).then(function (data) {
                    self.data['logo'] = JSON.stringify({file_name: self.logo_file_name, data: data})
                    self.form_updated()
                })
                self.form_updated()
            })

            $(self.refs.competition_type).dropdown({
                onChange: self.form_updated,
            })
            $(self.refs.queue).dropdown({

                apiSettings: {
                    url: `${URLS.API}queues/?search={query}&public=true`,
                    cache: false
                },
                clearable: true,
                minCharacters: 2,
                fields: {
                    remoteValues: 'results',
                    value: 'id',
                },
                maxResults: 5,
                onChange: self.form_updated
            })
            self.update()
        })

        self.form_updated = function () {
            var is_valid = true

            self.data["title"] = self.refs.title.value
            self.data["description"] = self.markdown_editor.value()
            self.data["queue"] = self.refs.queue.value
            self.data["enable_detailed_results"] = self.refs.detailed_results.checked
            self.data["show_detailed_results_in_submission_panel"] = self.refs.show_detailed_results_in_submission_panel.checked
            self.data["show_detailed_results_in_leaderboard"] = self.refs.show_detailed_results_in_leaderboard.checked
            self.data["auto_run_submissions"] = self.refs.auto_run_submissions.checked
            self.data["can_participants_make_submissions_public"] = self.refs.can_participants_make_submissions_public.checked
            self.data["forum_enabled"] = self.refs.forum_enabled.checked
            self.data["make_programs_available"] = self.refs.make_programs_available.checked
            self.data["make_input_data_available"] = self.refs.make_input_data_available.checked
            self.data["docker_image"] = $(self.refs.docker_image).val()
            self.data["competition_type"] = $(self.refs.competition_type).dropdown('get value')
            self.data['fact_sheet'] = self.serialize_fact_sheet_questions()
            self.data['reward'] = $(self.refs.reward).val()
            self.data['contact_email'] = $(self.refs.contact_email).val()
            self.data['report'] = $(self.refs.report).val()
            if (self.data.fact_sheet === false){
                is_valid = false
            }

            if (!self.data['title'] || !self.data['docker_image'] || (!self.data['logo'] && !self.is_editing_competition)) {
                is_valid = false
            }
            CODALAB.events.trigger('competition_is_valid_update', 'details', is_valid)

            if (is_valid) {

                if (!self.data['logo'] && self.is_editing_competition) {
                    self.data['logo'] = undefined
                }
                CODALAB.events.trigger('competition_data_update', self.data)
            }
        }

        self.add_question = (type) => {
            let current_id = 0
            if(self.fact_sheet_questions[0] !== undefined) {
                current_id = self.fact_sheet_questions[self.fact_sheet_questions.length - 1].id + 1
            }
            if(type === 'boolean'){
                self.fact_sheet_questions.push({
                    "id": current_id,
                    "label": "",
                    "type": "checkbox"
                })
            }
            else if(type === 'text'){
                self.fact_sheet_questions.push({
                    "id": current_id,
                    "label": "",
                    "type": "text"
                })
            }
            else if(type === 'selection'){
                self.fact_sheet_questions.push({
                    "id": current_id,
                    "label": "",
                    "type": "select",
                    "selection": []
                })
            }
            self.update()
            $(':input', self.refs.comp_fact_sheet).not('button').not('[readonly]').each(function (i, field) {
                this.addEventListener('keyup', self.form_updated)
            })
        }

        self.remove_question = function (id) {
            self.fact_sheet_questions = self.fact_sheet_questions.filter(q => q.id !== id)
            self.update()
            self.form_updated()
        }

        self.serialize_fact_sheet_questions = function (){
            let form = $(self.refs.comp_fact_sheet).children()
            let form_json = {}
            for(question of form){
                let q_serialized = $(question).find(":input").serializeArray()
                let question_key = q_serialized[1].value
                form_json[question_key] = {}
                if(q_serialized[0].value === "checkbox"){
                    form_json[question_key]['selection'] = [true, false]
                } else if(q_serialized[0].value === "text") {
                    form_json[question_key]['selection'] = ""
                }
                for(entry of q_serialized){
                    if(entry.name.split('-')[0] === 'selection') {
                        let selection = entry.value.split(',')
                        selection = selection.map(s => s.trim()).filter(s => s !== '')
                        form_json[question_key][entry.name.split('-')[0]] = selection
                    } else if (entry.name.split('-')[0] === 'key'){

                        if(!entry.value){
                            return false
                        }
                        form_json[question_key][entry.name.split('-')[0]] = entry.value
                    } else {
                        form_json[question_key][entry.name.split('-')[0]] = entry.value
                    }
                }
                if(form_json[question_key]['type'] === 'select' && form_json[question_key]['is_required'] === 'false'){
                    form_json[question_key]['selection'].unshift('')
                }
            }
            if(form_json.length === 0){
                return null
            }
            return form_json
        }

        self.filter_queues = function (filters) {
            filters = filters || {}
            _.defaults(filters, {
                search: $(self.refs.queue_search).val(),
                page: 1,
            })
            self.page = filters.page
            self.get_available_queues(filters)
        }

        CODALAB.events.on('competition_loaded', function (competition) {
            self.is_editing_competition = true
            self.refs.title.value = competition.title
            self.markdown_editor.value(competition.description || '')

            self.uploaded_logo_name = competition.logo.replace(/\\/g, '/').replace(/.*\//, '')
            self.uploaded_logo = competition.logo
            if (competition.queue) {
                $(self.refs.queue)
                    .dropdown('set text', competition.queue.name)
                    .dropdown('set value', competition.queue.id)
            }
            self.refs.detailed_results.checked = competition.enable_detailed_results
            self.refs.show_detailed_results_in_submission_panel.checked = competition.show_detailed_results_in_submission_panel
            self.refs.show_detailed_results_in_leaderboard.checked = competition.show_detailed_results_in_leaderboard
            self.refs.auto_run_submissions.checked = competition.auto_run_submissions
            self.refs.can_participants_make_submissions_public.checked = competition.can_participants_make_submissions_public
            self.refs.forum_enabled.checked = competition.forum_enabled
            self.refs.make_programs_available.checked = competition.make_programs_available
            self.refs.make_input_data_available.checked = competition.make_input_data_available
            $(self.refs.docker_image).val(competition.docker_image)
            $(self.refs.reward).val(competition.reward)
            $(self.refs.contact_email).val(competition.contact_email)
            $(self.refs.report).val(competition.report)
            if(competition.fact_sheet !== null){
                for(question in competition.fact_sheet){
                    var q_json = competition.fact_sheet[question]
                    q_json.id = self.fact_sheet_questions.length
                    if(q_json.type === "select"){
                        q_json.selection = q_json.selection.filter(s => s !== "")
                    }
                    self.fact_sheet_questions.push(q_json)
                }
            }
            self.update()
            self.form_updated()

            $(self.refs.competition_type).dropdown('set selected', competition.competition_type)

            $(':input', self.root).not('[type="file"]').not('button').not('[readonly]').each(function (i, field) {
                this.addEventListener('keyup', self.form_updated)
            })
        })
        CODALAB.events.on('update_codemirror', () => {
            self.markdown_editor.codemirror.refresh()
        })
});

riot.tag2('competition-leaderboards', '<div class="ui center aligned grid"> <div class="row"> <div class="fourteen wide column"> <table class="ui padded table"> <thead> <tr> <th colspan="2">Leaderboards</th> </tr> </thead> <tbody> <tr each="{board, index in leaderboards}"> <td>{board.title}</td> <td class="right aligned"> <a class="chevron"> <sorting-chevrons data="{leaderboards}" index="{index}" onupdate="{form_updated}"></sorting-chevrons> </a> <a class="icon-button" onclick="{edit.bind(this, index)}"> <i class="blue edit icon"></i> </a> <a class="icon-button" onclick="{delete_leaderboard.bind(this, index)}"> <i selenium="delete-column" class="red trash alternate outline icon"></i> </a> </td> </tr> <tr show="{leaderboards.length === 0}"> <td colspan="2" class="center aligned"> <em>No leaderboards added yet, at least 1 is required!</em> </td> </tr> </tbody> <tfoot> <tr> <th colspan="2" class="right aligned"> <button if="{leaderboards.length === 0}" class="ui tiny inverted green icon button" onclick="{add}"> <i selenium="add-leaderboard" class="add icon"></i> Add leaderboard </button> <button if="{leaderboards.length > 0}" disabled="disabled" class="ui tiny inverted green icon button disabled"> <i selenium="add-leaderboard" class="add icon"></i> Add leaderboard </button> </th> </tr> </tfoot> </table> </div> </div> </div> <div class="ui large modal" ref="modal"> <i class="close icon"></i> <div class="header"> Leaderboard form </div> <div class="scrolling content"> <div class="ui warning message" show="{!_.isEmpty(error_messages)}"> <div class="header"> Leaderboard Errors </div> <ul class="list"> <li each="{message in error_messages}"> {message} </li> </ul> </div> <div ref="leaderboard_form" class="ui form"> <input type="hidden" name="id" riot-value="{_.get(selected_leaderboard, \'id\', null)}"> <div class="field"> <label>Leaderboard Settings</label> <div class="two fields"> <div class="field required"> <label>Title</label> <input selenium="title1" name="title" riot-value="{_.get(selected_leaderboard, \'title\')}" onchange="{modal_updated}"> </div> <div class="field required"> <label> Key <span data-tooltip="This is the key you will use to assign scores to leaderboards in your scoring program" data-inverted="" data-position="right center"> <i class="help icon circle"></i> </span> </label> <input selenium="key" name="key" riot-value="{_.get(selected_leaderboard, \'key\')}" onchange="{modal_updated}"> </div> </div> <div class="field"> <div class="ui checkbox"> <input type="checkbox" ref="hidden_leaderboard"> <label>Leaderboard is Hidden</label> </div> </div> </div> <div class="field" style="width: 50%; padding: 0 7px"> <label>Submission Rule</label> <div class="ui fluid submission-rule selection dropdown"> <input type="hidden" name="submission_rule" ref="submission_rule" riot-value="{_.get(selected_leaderboard, \'submission_rule\', \'Add\')}"> <div class="default text"></div> <i class="dropdown icon"></i> <div class="menu"> <div each="{rule in submission_rules}" class="item" data-value="{rule}">{rule.replaceAll(⁗_⁗, ⁗ ⁗)}</div> </div> </div> </div> <table class="ui celled definition table"> <thead> <tr> <th width="125px"></th> <th if="{_.isEmpty(columns)}"></th> <th each="{column, index in columns || []}" style="min-width: 200px;"> <input type="text" class="ui field" name="title_{index}" riot-value="{_.get(column, \'title\')}" onchange="{update_leaderboard}"> <input type="hidden" name="id_{index}" riot-value="{_.get(column, \'id\')}"> </th> </tr> </thead> <tbody> <tr> <td>Primary Column</td> <td if="{_.isEmpty(columns)}" rowspan="5"><em>No Columns Yet!</em></td> <td each="{column, index in columns || []}" class="center aligned"> <input type="radio" name="primary_index" data-index="{index}" checked="{index === _.get(selected_leaderboard, \'primary_index\')}"> </td> </tr> <tr> <td>Computation</td> <td each="{column, index in columns || []}"> <div class="ui fluid computation selection dropdown"> <input type="hidden" name="computation_{index}" riot-value="{column.computation || \'none\'}" onchange="{modal_updated}"> <div class="default text"></div> <i class="dropdown icon"></i> <div class="menu"> <div class="item" data-index="{index}" data-value="none">None</div> <div class="item" data-index="{index}" data-value="avg">Average</div> <div class="item" data-index="{index}" data-value="sum">Sum</div> <div class="item" data-index="{index}" data-value="min">Min</div> <div class="item" data-index="{index}" data-value="max">Max</div> </div> </div> <label if="{column.computation}" style="display: block; padding-top: 10px;">Apply to:</label> <select class="ui fluid multiselect index_{index} dropdown" if="{column.computation}" multiple="" id="computation_indexes_{index}" name="computation_indexes_{index}" onchange="{modal_updated}"> <option each="{inner_column, inner_index in columns}" if="{inner_index !== index}" selected="{_.includes(column.computation_indexes, inner_index.toString())}" riot-value="{inner_index}"> {inner_column.title} </option> </select> </td> </tr> <tr> <td> Sorting <span data-tooltip="Asc: smaller is better -- Desc: larger is better" data-position="right center"><i class="circle question icon"></i></span> </td> <td each="{column, index in columns || []}"> <div class="ui fluid sorting selection dropdown"> <input type="hidden" name="sorting_{index}" riot-value="{column.sorting || \'desc\'}"> <div class="default text">Sorting</div> <i class="dropdown icon"></i> <div class="menu"> <div class="item" data-value="desc">Descending</div> <div class="item" data-value="asc">Ascending</div> </div> </div> </td> </tr> <tr> <td>Column Key <span style="color: red;">*</span></td> <td each="{column, index in columns || []}"> <input selenium="column-key" type="text" class="ui field" name="column_key_{index}" riot-value="{_.get(column, \'key\')}" onchange="{modal_updated}"> </td> </tr> <tr> <td>Column Precision <span style="color: red;">*</span></td> <td each="{column, index in columns || []}"> <input selenium="column-precision" class="ui field" name="column_precision_{index}" riot-value="{_.get(column, \'precision\') || 2}" min="1" max="10" onchange="{modal_updated}" type="{\'number\'}"> </td> </tr> <tr> <td>Hidden</td> <td each="{column, index in columns || []}" style="text-align: center;"> <input selenium="hidden" type="checkbox" ref="hidden_{index}" checked="{column.hidden}" onchange="{modal_updated}"> </td> </tr> <tr> <td></td> <td each="{column, index in columns || []}" class="center aligned"> <a onclick="{move_column.bind(this, index, -1)}" class="icon-button"><i class="chevron left icon {disabled: index === 0}"></i></a> <a class="icon-button" onclick="{delete_column.bind(this, index)}"><i class="red trash alternate outline icon"></i></a> <a onclick="{move_column.bind(this, index, 1)}" class="icon-button"><i class="chevron right icon {disabled: index + 1 === _.get(selected_leaderboard, \'columns.length\', 0)}"></i></a> </td> </tr> </tbody> </table> </div> </div> <div class="actions"> <div selenium="add-column" class="ui inverted green icon button" onclick="{add_column}"><i class="ui plus icon"></i> Add column</div> <div class="ui button" onclick="{close_modal}">Cancel</div> <div selenium="save3" class="ui button primary {disabled: !modal_is_valid}" onclick="{save}">Save</div> </div> </div>', 'competition-leaderboards a.icon-button:hover,[data-is="competition-leaderboards"] a.icon-button:hover{ cursor: pointer; }', '', function(opts) {
        var self = this

        self.leaderboards = []
        self.selected_leaderboard_index = undefined
        self.selected_leaderboard = undefined
        self.selected_submission_rule = undefined
        self.columns = []
        self.modal_is_valid = false
        self.error_messages = []
        self.submission_rules = [
            "Add",
            "Add_And_Delete",
            "Add_And_Delete_Multiple",
            "Force_Last",
            "Force_Latest_Multiple",
            "Force_Best",
        ]
        self.on('mount', () => {
            $(self.refs.modal).modal({
                closable: false,
                onHidden: self.clear_form,
                onShow: self.initialize_dropdowns
            })
        })

        self.initialize_dropdowns = function () {
            $('.ui.sorting.dropdown').dropdown()
            $('.ui.multiselect.dropdown').dropdown()
            $('.ui.submission-rule.dropdown').dropdown({
                onChange: (value, text, element) => {
                    self.change_submission_rule(value)
                    self.update()
                }
            })
            $('.ui.computation.dropdown').dropdown({
                onChange: (value, text, element) => {
                    let index = element.data().index
                    if (value === 'none') {
                        self.columns[index].computation = null
                        self.update()
                        $(`.ui.multiselect.index_${index}.dropdown`)
                            .dropdown('clear')

                            .css('display', 'none')
                    } else {
                        self.columns[index].computation = value
                        self.update()
                        $('.ui.multiselect.dropdown').dropdown({
                            onChange: () => {
                                self.update_leaderboard()
                            }
                        })
                    }
                }
            })
        }

        self.add = function () {
            self.selected_leaderboard = {
                primary_index: 0,
            }
            self.columns = []
            self.add_column()
            self.show_modal()
        }

        self.edit = function (index) {
            self.selected_leaderboard_index = index

            self.selected_leaderboard = _.cloneDeep(self.leaderboards[index])
            self.refs.hidden_leaderboard.checked = self.selected_leaderboard.hidden
            self.columns = self.selected_leaderboard.columns || []
            self.update()
            self.show_modal()
        }

        self.change_submission_rule = function (rule) {
            self.selected_submission_rule = rule
        }

        self.show_modal = function () {
            $(self.refs.modal).modal('show')
            self.modal_updated()
        }

        self.close_modal = function () {
            $(self.refs.modal).modal('hide')
        }

        self.delete_leaderboard = function (index) {
            if (confirm("Are you sure you want to delete this?")) {
                self.leaderboards.splice(index, 1)
                self.update()
                self.form_updated()
            }
        }

        self.save = function () {
            if (self.selected_leaderboard_index >= 0) {
                self.leaderboards[self.selected_leaderboard_index] = self.get_leaderboard_data()
            } else {
                self.leaderboards.push(self.get_leaderboard_data())
            }
            self.form_updated()
            self.close_modal()
            self.update()
            self.selected_submission_rule = undefined
        }

        self.clear_form = function () {
            self.selected_leaderboard_index = undefined
            self.selected_leaderboard = undefined
            self.columns = []
            self.update()
        }

        self.modal_updated = function () {
            self.modal_is_valid = self.validate_leaderboard(self.get_leaderboard_data())
            self.update()
        }

        self.form_updated = function () {
            let is_valid = true

            if (_.isEmpty(self.leaderboards)) {
                is_valid = false
            } else if (_.some(self.leaderboards, leaderboard => _.isEmpty(leaderboard.columns))) {
                is_valid = false
            } else {
                _.forEach(self.leaderboards, leaderboard => {
                    if (is_valid) {
                        if (!self.validate_leaderboard(leaderboard)) {
                            is_valid = false
                        }
                    }
                })
            }

            CODALAB.events.trigger('competition_is_valid_update', 'leaderboards', is_valid)

            if (is_valid) {
                CODALAB.events.trigger('competition_data_update', {leaderboards: self.leaderboards})
            }
            return is_valid
        }

        self.validate_leaderboard = function (leaderboard) {
            self.error_messages = []
            let is_valid = true
            if (!leaderboard.key || !leaderboard.title) {
                is_valid = false
            }
            _.forEach(leaderboard.columns, column => {
                if (!column.key || !column.title) {
                    is_valid = false
                } else if (column.computation) {
                    if (_.isEmpty(column.computation_indexes)) {
                        is_valid = false
                    } else {
                        let indexes = _.map(column.computation_indexes, index => parseInt(index))
                        _.forEach(indexes, index => {
                            let reference_column = leaderboard.columns[index]
                            if (_.includes(_.get(reference_column, 'computation_indexes', []), column.index.toString())) {
                                is_valid = false
                                self.error_messages.push(`Cyclical computation references at column indexes: ${_.join(_.sortBy([reference_column.index, column.index]), ', ')}.`)
                            }
                        })
                    }
                }
            })
            self.error_messages = _.uniq(self.error_messages)
            return is_valid
        }

        self.get_leaderboard_data = function () {
            let data = get_form_data(self.refs.leaderboard_form)
            let leaderboard = {
                id: data.id,
                title: data.title,
                key: data.key,
                precision : (data.precision === undefined) ? 2 : data.precision ,
                submission_rule: self.selected_submission_rule,
                hidden: self.refs.hidden_leaderboard.checked,
                primary_index: _.get($('input[name=primary_index]:checked').data(), 'index', 0),
                columns: _.map(_.range(_.get(self.selected_leaderboard, 'columns.length', 0)), i => {
                    let column = {
                        index: i,
                        title: _.get(data, `title_${i}`),
                        key: _.get(data, `column_key_${i}`),
                        precision: _.get(data, `column_precision_${i}`),
                        sorting: _.get(data, `sorting_${i}`),
                        hidden: self.refs[`hidden_${i}`].checked,
                    }
                    let id = _.get(data, `id_${i}`)
                    if (id) {
                        column.id = id
                    }
                    let computation = _.get(data, `computation_${i}`)
                    if (computation !== 'none') {
                        column.computation = computation
                        column.computation_indexes = _.get(data, `computation_indexes_${i}`)
                    } else {
                        column.computation = null
                        column.computation_indexes = null
                    }
                    return column
                })
            }
            return leaderboard
        }

        self.update_leaderboard = function () {
            self.selected_leaderboard = self.get_leaderboard_data()
            self.columns = self.selected_leaderboard.columns
            self.update()
            self.initialize_dropdowns()
            self.modal_updated()
        }

        self.add_column = function () {
            self.columns.push({title: 'New Column'})
            self.update()
            _.delay(() => self.update_leaderboard(), 10)
        }

        self.delete_column = function (index) {
            _.pullAt(self.columns, index)
            self.update()
            self.update_leaderboard()
        }

        self.move_column = function (index, offset) {
            let from_index = index
            let to_index = index + offset
            let data_to_move = self.columns[from_index]
            self.columns.splice(from_index, 1)
            self.columns.splice(to_index, 0, data_to_move)
            self.columns = _.map(self.columns, (column, i) => {
                column.index = i
                return column
            })

            from_index = from_index.toString()
            to_index = to_index.toString()
            self.columns = _.map(self.columns, column => {
                let comp_indexes = _.get(column, 'computation_indexes')
                if (comp_indexes) {
                    let push_to = false
                    let push_from = false
                    if (_.includes(comp_indexes, from_index)) {
                        _.pull(column.computation_indexes, from_index)
                        push_to = true
                    }
                    if (_.includes(comp_indexes, to_index)) {
                        _.pull(column.computation_indexes, to_index)
                        push_from = true
                    }
                    if (push_from) {
                        column.computation_indexes.push(from_index)
                    }
                    if (push_to) {
                        column.computation_indexes.push(to_index)
                    }
                }
                return column
            })
            self.update()
            self.update_leaderboard()
        }

        CODALAB.events.on('competition_loaded', function(competition){
            self.leaderboards = competition.leaderboards
            self.form_updated()
        })
});

riot.tag2('competition-pages', '<div class="ui centered grid"> <div class="row"> <div class="fourteen wide column"> <table class="ui padded striped table"> <thead> <tr> <th colspan="2">Pages</th> </tr> </thead> <tbody> <tr each="{page, index in pages}"> <td>{page.title}</td> <td class="right aligned"> <a class="chevron"> <sorting-chevrons data="{pages}" index="{index}" onupdate="{form_updated}"></sorting-chevrons> </a> <a class="icon-button" onclick="{view_page.bind(this, index)}"> <i class="grey eye icon"></i> </a> <a class="icon-button" onclick="{edit.bind(this, index)}"> <i class="blue edit icon"></i> </a> <a class="icon-button" onclick="{delete_page.bind(this, index)}"> <i class="red trash alternate outline icon"></i> </a> </td> </tr> <tr show="{pages.length === 0}"> <td class="center aligned" colspan="2"> <em>No pages added yet, at least 1 is required!</em> </td> </tr> </tbody> <tfoot> <tr> <th colspan="2" class="right aligned"> <button class="ui tiny inverted green icon button" onclick="{add}"> <i class="add icon"></i> Add page </button> </th> </tr> </tfoot> </table> </div> </div> </div> <div class="ui modal" ref="edit_modal"> <i class="close icon"></i> <div class="header"> Page form </div> <div class="content"> <form class="ui form" onsubmit="{save}"> <div class="field required"> <label>Title</label> <input selenium="title" ref="title"> </div> <div class="field required"> <label>Content</label> <textarea class="markdown-editor" ref="content"></textarea> </div> </form> </div> <div class="actions"> <div class="ui button" onclick="{close_edit}">Cancel</div> <div class="ui button primary" selenium="save1" onclick="{save}">Save</div> </div> </div> <div class="ui modal" ref="view_modal"> <i class="close icon"></i> <div class="header"> Page Preview </div> <div class="scrolling content"> <div ref="page_content"> </div> </div> <div class="actions"> <div class="ui button primary" onclick="{edit.bind(this, selected_page_index)}">Edit</div> <div class="ui button" onclick="{close_view}">Close</div> </div> </div>', 'competition-pages .chevron,[data-is="competition-pages"] .chevron,competition-pages .icon-button,[data-is="competition-pages"] .icon-button{ cursor: pointer; }', '', function(opts) {
        var self = this

        self.simple_markdown_editor = undefined
        self.selected_page_index = undefined
        self.pages = []

        self.one("mount", function () {

            self.simple_markdown_editor = create_easyMDE(self.refs.content)

            $(self.refs.edit_modal).modal({
                onShow: function () {
                    setTimeout(function () {
                        self.simple_markdown_editor.codemirror.refresh()
                    }.bind(self.simple_markdown_editor), 10)
                }
            })
        })

        self.add = function () {

            self.selected_page_index = undefined

            self.clear_form()
            $(self.refs.edit_modal).modal('show')
        }

        self.clear_form = function () {
            self.refs.title.value = ''
            self.simple_markdown_editor.value('')
        }

        self.close_edit = function () {
            $(self.refs.edit_modal).modal('hide')
        }
        self.close_view = function () {
            $(self.refs.view_modal).modal('hide')
        }

        self.edit = function (page_index) {
            self.selected_page_index = page_index
            var page = self.pages[page_index]
            self.refs.title.value = page.title
            self.refs.content.value = page.content
            self.simple_markdown_editor.value(page.content)

            $(self.refs.edit_modal).modal('show')
        }

        self.delete_page = function (page_index) {
            if (confirm("Are you sure you want to delete '" + self.pages[page_index].title + "'?")) {
                self.pages.splice(page_index, 1)
                self.form_updated()
            }
        }

        self.view_page = function (page_index) {
            self.selected_page_index = page_index
            $(self.refs.view_modal).modal('show')
            const rendered_content = renderMarkdownWithLatex(self.pages[page_index].content)
            self.refs.page_content.innerHTML = ""
            rendered_content.forEach(node => {
                self.refs.page_content.appendChild(node.cloneNode(true));
            });
        }

        self.form_updated = function () {
            var is_valid = true

            if (self.pages.length === 0) {
                is_valid = false
            } else {
                var content = self.pages[0].content
                if (content === undefined || content === '') {
                    is_valid = false
                }
            }

            CODALAB.events.trigger('competition_is_valid_update', 'pages', is_valid)

            if(is_valid) {

                var indexed_pages = self.pages.map(function(page, index) {
                    page.index = index
                    return page
                })
                CODALAB.events.trigger('competition_data_update', {pages: indexed_pages})
            }
        }

        self.save = function (event) {
            if(event) {
                event.preventDefault()
            }

            var data = {
                title: self.refs.title.value,
                content: self.simple_markdown_editor.value()
            }

            if(data.content === '') {
                toastr.error("Cannot save, content is required for a page to save")
                return
            }

            $(self.refs.edit_modal).modal('hide')

            if(self.selected_page_index === undefined) {
                self.pages.push(data)
            } else {
                self.pages[self.selected_page_index] = data
            }

            self.clear_form()
            self.form_updated()
        }

        CODALAB.events.on('competition_loaded', function(competition){
            self.pages = _.orderBy(competition.pages, 'index')
            self.form_updated()
        })
});

riot.tag2('competition-participation', '<form class="ui form"> <div class="field required"> <label>Terms</label> <textarea class="markdown-editor" ref="terms" name="terms"></textarea> </div> <div class="field"> <div class="ui checkbox"> <input selenium="auto-approve" type="checkbox" name="registration_auto_approve" ref="registration_auto_approve" onchange="{form_updated}"> <label>Auto approve registration requests <span data-tooltip="If left unchecked, registration requests must be manually approved by the benchmark creator or collaborators" data-inverted="" data-position="bottom center"> <i class="help icon circle"></i></span> </label> </div> </div> <div class="field"> <div class="ui checkbox"> <input type="checkbox" name="allow_robot_submissions" ref="allow_robot_submissions" onchange="{form_updated}"> <label>Allow robot submissions <span data-tooltip="If left unchecked, robot users will have to be manually approved by the benchmark creator or collaborators. This can be changed later." data-inverted="" data-position="bottom center"> <i class="help icon circle"></i></span> </label> </div> </div> <div class="field"> <label>Whitelist Emails</label> <p>A list of emails (one per line) of users who do not require competition organizer\'s approval to enter this competition.</p> <div class="ui yellow message"> <span><b>Note:</b></span><br> Only valid emails are allowed<br> Empty lines are not allowed </div> <textarea class="markdown-editor" ref="whitelist_emails" name="whitelist_emails"></textarea> <div class="error-message" style="color: red;"></div> </div> </form>', '', '', function(opts) {
        let self = this

        self.data = {}

        self.on('mount', () => {
            self.markdown_editor = create_easyMDE(self.refs.terms)
            self.markdown_editor_whitelist = create_easyMDE(self.refs.whitelist_emails, false, false, '200px')

            $(':input', self.root).not('[type="file"]').not('button').not('[readonly]').each(function (i, field) {
                this.addEventListener('keyup', self.form_updated)
            })
        })

        self.form_updated = () => {
            self.data.registration_auto_approve = $(self.refs.registration_auto_approve).prop('checked')
            self.data.allow_robot_submissions = $(self.refs.allow_robot_submissions).prop('checked')
            self.data.terms = self.markdown_editor.value()

            let whitelist_emails_content = self.markdown_editor_whitelist.value()
            let email_addresses = whitelist_emails_content.trim() === '' ? [] : whitelist_emails_content.split('\n').map(email => email.trim())

            let problematicEmailIndexes = []
            email_addresses.forEach((email, index) => {
                if (!self.isValidEmail(email)) {

                    problematicEmailIndexes.push(index);
                }
            })

            const errorDiv = self.root.querySelector('.error-message')
            if (problematicEmailIndexes.length > 0) {

                errorDiv.classList.add('ui', 'red', 'message')

                const errorMessage = document.createElement('strong')
                errorMessage.textContent = 'One or more email addresses are invalid'
                errorDiv.innerHTML = ''
                errorDiv.appendChild(errorMessage)

                const errorList = document.createElement('ul')

                problematicEmailIndexes.forEach((index) => {
                    const problematicEmail = email_addresses[index]

                    const listItem = document.createElement('li')
                    listItem.textContent = `${problematicEmail}`
                    errorList.appendChild(listItem)
                })

                errorDiv.appendChild(errorList)
            } else {

                errorDiv.classList.remove('ui', 'red', 'message')
                errorDiv.textContent = ''
            }

            if(problematicEmailIndexes.length == 0){
                self.data.whitelist_emails = email_addresses
            }

            let is_valid_emails = problematicEmailIndexes.length == 0
            let is_valid_terms = !!self.data.terms

            is_valid = is_valid_terms && is_valid_emails

            CODALAB.events.trigger('competition_is_valid_update', 'participation', is_valid)

            if (is_valid) {
                CODALAB.events.trigger('competition_data_update', self.data)
            }
        }

        self.isValidEmail = function (email) {

            const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/

            return emailPattern.test(email)
}

        CODALAB.events.on('competition_loaded', function (competition) {
            self.refs.registration_auto_approve.checked = competition.registration_auto_approve
            self.refs.allow_robot_submissions.checked = competition.allow_robot_submissions
            self.markdown_editor.value(competition.terms || '')

            self.markdown_editor_whitelist.value(Array.isArray(competition.whitelist_emails) && competition.whitelist_emails.length > 0 ? competition.whitelist_emails.join('\n') : '')
            self.markdown_editor.codemirror.refresh()
            self.update()
            self.form_updated()
        })

        CODALAB.events.on('update_codemirror', () => {
            self.markdown_editor.codemirror.refresh()
        })
});

riot.tag2('competition-phases', '<div class="ui warning message" if="{warnings.length > 0}"> <div class="header"> Phase Errors </div> <ul class="list"> <li each="{item in warnings}">{item}</li> </ul> </div> <div class="ui center aligned grid"> <div class="row"> <div class="fourteen wide column"> <table class="ui padded table"> <thead> <tr> <th colspan="2">Phases</th> </tr> </thead> <tbody> <tr each="{phase, index in phases}"> <td>{phase.name}</td> <td class="right aligned"> <a class="chevron"> <sorting-chevrons data="{phases}" index="{index}" onupdate="{form_updated}"></sorting-chevrons> </a> <a class="icon-button" onclick="{edit.bind(this, index)}"> <i class="blue edit icon"></i> </a> <a class="icon-button" onclick="{delete_phase.bind(this, index)}"> <i class="red trash alternate outline icon"></i> </a> </td> </tr> <tr show="{phases.length === 0}"> <td colspan="2" class="center aligned"> <em>No phases added yet, at least 1 is required!</em> </td> </tr> </tbody> <tfoot> <tr> <th colspan="2" class="right aligned"> <button class="ui tiny inverted green icon button" onclick="{add}"> <i selenium="add-phase" class="add circle icon"></i> Add phase </button> </th> </tr> </tfoot> </table> </div> </div> </div> <div class="ui large modal" ref="modal"> <i class="close icon"></i> <div class="header"> {typeof selected_phase_index === \'undefined\' ?  \'Add Phase\' : \'Edit Phase\'} </div> <div class="content"> <form selenium="phase-form" class="ui form" ref="form"> <div class="field required"> <label>Name</label> <input name="name"> </div> <div class="two fields"> <div class="ui calendar field required" ref="calendar_start_date"> <label>Start Date</label> <div class="ui input left icon"> <i class="calendar icon"></i> <input type="text" name="start_date"> </div> </div> <div class="ui calendar field required" ref="calendar_start_time"> <label>Start Time <span data-tooltip="Select time in UTC+0 time zone" data-inverted="" data-position="bottom center"><i class="help icon circle"></i></span> </label> <div class="ui input left icon"> <i class="clock icon"></i> <input type="text" name="start_time"> </div> </div> </div> <div class="two fields"> <div class="ui calendar field" ref="calendar_end_date"> <label>End Date</label> <div class="ui input left icon"> <i class="calendar icon"></i> <input type="text" name="end_date"> </div> </div> <div class="ui calendar field" ref="calendar_end_time"> <label>End Time <span data-tooltip="Select time in UTC+0 time zone" data-inverted="" data-position="bottom center"><i class="help icon circle"></i></span> </label> <div class="ui input left icon"> <i class="clock icon"></i> <input type="text" name="end_time"> </div> </div> </div> <div class="fluid field required" ref="tasks_select_container" id="tasks_select_container"> <label for="tasks"> Tasks (Order will be saved) Note: Adding a new task will cause all submissions to be run against it. <span data-tooltip="Use Resources section to create new tasks" data-inverted="" data-position="bottom center"><i class="help icon circle"></i></span> </label> <select name="tasks" id="tasks" class="ui search selection dropdown" ref="multiselect" multiple="multiple"> </select> </div> <div class="fluid field" ref="public_data_select_container" id="public_data_select_container"> <label for="public_data"> Public Data (Only 1 per phase) <span data-tooltip="Use Resources section to create new public datasets" data-inverted="" data-position="bottom center"><i class="help icon circle"></i></span> </label> <select name="public_data" id="public_data" class="ui search selection dropdown" ref="public_data_multiselect" multiple="multiple"> </select> </div> <div class="fluid field" ref="starting_kit_select_container" id="starting_kit_select_container"> <label for="starting_kit"> Starting Kit (Only 1 per phase) <span data-tooltip="Use Resources section to create new starting kits" data-inverted="" data-position="bottom center"><i class="help icon circle"></i></span> </label> <select name="starting_kit" id="starting_kit" class="ui search selection dropdown" ref="starting_kit_multiselect" multiple="multiple"> </select> </div> <div class="field smaller-mde"> <label>Description</label> <textarea class="markdown-editor" ref="description" name="description"></textarea> </div> <div class="ui accordion" ref="advanced_settings"> <div class="title"> <i class="dropdown icon"></i> Advanced <i class="cogs icon"></i> </div> <div class="content"> <div class="three fields"> <div class="field"> <label> Execution Time Limit (seconds)<span data-tooltip="600s if unset, {CODALAB.state.public_env_variables.MAX_EXECUTION_TIME_LIMIT}s max with default queue." data-inverted="" data-position="bottom center"> <i class="help icon circle"></i></span> </label> <input name="execution_time_limit" type="number"> </div> <div class="field"> <label> Max Submissions Per Day <span data-tooltip="The maximum number of submissions a user can be made per day" data-inverted="" data-position="bottom center"> <i class="help icon circle"></i></span> </label> <input name="max_submissions_per_day" type="number"> </div> <div class="field"> <label> Max Submissions Per Person <span data-tooltip="The maximum number of submissions any single user can make to the phase" data-inverted="" data-position="bottom center"> <i class="help icon circle"></i></span> </label> <input name="max_submissions_per_person" type="number"> </div> </div> <div class="field"> <div class="ui checkbox"> <label>Hide Submission Output <span data-tooltip="Hide all submission output" data-inverted="" data-position="bottom center"><i class="help icon circle"></i></span> </label> <input type="checkbox" ref="hide_output"> </div> </div> <div class="field"> <div class="ui checkbox"> <label>Hide Prediction Output <span data-tooltip="Prevent participants from downloading \'Output from prediction step\'" data-inverted="" data-position="bottom center"><i class="help icon circle"></i></span> </label> <input type="checkbox" ref="hide_prediction_output"> </div> </div> <div class="field"> <div class="ui checkbox"> <label>Hide Score Output <span data-tooltip="Prevent participants from downloading \'Output from scoring step\'" data-inverted="" data-position="bottom center"><i class="help icon circle"></i></span> </label> <input type="checkbox" ref="hide_score_output"> </div> </div> <div class="inline field" if="{phases.length > 0 && ![null, undefined, 0].includes(selected_phase_index)}"> <div class="ui checkbox"> <input type="checkbox" name="auto_migrate_to_this_phase" ref="auto_migrate"> <label> Auto migrate to this phase <span data-tooltip="Re-submit all leaderboard submissions automatically when the phase starts." data-inverted="" data-position="bottom center"> <i class="help icon circle"></i></span> </label> </div> </div> </div> </div> </form> </div> <div class="actions"> <a href="{URLS.TASK_MANAGEMENT}" class="ui inverted green button" target="_blank"> <i class="logout icon"></i>Manage Tasks / Datasets </a> <div class="ui button" onclick="{close_modal}">Cancel</div> <div selenium="save2" class="ui button primary {disabled: !form_is_valid}" onclick="{save}">Save</div> </div> </div>', 'competition-phases .chevron,[data-is="competition-phases"] .chevron,competition-phases .icon-button,[data-is="competition-phases"] .icon-button{ cursor: pointer; }', '', function(opts) {
        var self = this

        self.has_initialized_calendars = false
        self.form_is_valid = false
        self.phases = []
        self.phase_tasks = []
        self.phase_public_data = []
        self.phase_starting_kit = []
        self.selected_phase_index = undefined
        self.warnings = []

        self.one("mount", function () {
            $('.ui.checkbox', self.root).checkbox()

            self.simple_markdown_editor = create_easyMDE(self.refs.description)

            $(self.refs.multiselect).dropdown({
                apiSettings: {
                    url: `${URLS.API}tasks/?public=true&search={query}`,
                    cache: false,
                    onResponse: (data) => {
                        return {success: true, results: _.values(data.results)}
                    },
                },
                onAdd: self.task_added,
                onRemove: self.task_removed,
            })

            $(self.refs.public_data_multiselect).dropdown({
                apiSettings: {
                    url: `${URLS.API}datasets/?search={query}&type=public_data`,
                    cache: false,
                    onResponse: (data) => {
                        return {success: true, results: _.values(data.results)}
                    },
                },
                onAdd: self.public_data_added,
                onRemove: self.public_data_removed,
            })

            $(self.refs.starting_kit_multiselect).dropdown({
                apiSettings: {
                    url: `${URLS.API}datasets/?search={query}&type=starting_kit`,
                    cache: false,
                    onResponse: (data) => {
                        return {success: true, results: _.values(data.results)}
                    },
                },
                onAdd: self.starting_kit_added,
                onRemove: self.starting_kit_removed,
            })

            $(':input', self.root).not('[type="file"]').not('button').not('[readonly]').each(function (i, field) {
                this.addEventListener('keyup', self.form_updated)
            })

            $(self.refs.modal).modal({
                onShow: function () {
                    setTimeout(function () {
                        self.simple_markdown_editor.codemirror.refresh()
                    }.bind(self.simple_markdown_editor), 10)
                },
                onHidden: () => {
                    self.clear_form()
                }
            })
            $(self.refs.advanced_settings).accordion()
        })

        self.task_added = (key, text, item) => {
            let index = _.findIndex(self.phase_tasks, (task) => {
                return task.value === key
            })
            if (index === -1) {
                let task = {name: text, value: key, selected: true}
                    self.phase_tasks.push(task)
            }
            self.form_updated()
        }

        self.task_removed = (key, text, item) => {
            let index = _.findIndex(self.phase_tasks, (task) => {
                return task.value === key
            })
            self.phase_tasks.splice(index, 1)
            self.form_updated()
        }

        self.public_data_added = (key, text, item) => {
            let index = _.findIndex(self.phase_public_data, (public_data) => {
                if (public_data === null){
                    return false
                }else{
                    if (public_data.value != key){

                        alert("Only one Public Data set allowed per phase.")
                        setTimeout(()=>{$('a[data-value="'+ key +'"] .delete.icon').click()},100)
                    }
                    return public_data.value === key
                }
            })
            if (index === -1 && (self.phase_public_data.length === 0 || self.phase_public_data[0] === null)) {
                let public_data = {name: text, value: key, selected: true}
                self.phase_public_data[0] = public_data
            }
            self.form_updated()
        }

        self.public_data_removed = (key, text, item) => {
            let index = _.findIndex(self.phase_public_data, (public_data) => {
                return public_data.value === key
            })
            if (index != -1){
                self.phase_public_data.splice(index, 1)
            }
            self.form_updated()
        }

        self.starting_kit_added = (key, text, item) => {
            let index = _.findIndex(self.phase_starting_kit, (starting_kit) => {
                if (starting_kit === null){
                    return false
                }else{
                    if (starting_kit.value != key){

                        alert("Only one Starting Kit set allowed per phase.")
                        setTimeout(()=>{$('a[data-value="'+ key +'"] .delete.icon').click()},100)
                    }
                    return starting_kit.value === key
                }
            })
            if (index === -1 && (self.phase_starting_kit.length === 0 || self.phase_starting_kit[0] === null)) {
                let starting_kit = {name: text, value: key, selected: true}
                self.phase_starting_kit[0] = starting_kit
            }
            self.form_updated()
        }

        self.starting_kit_removed = (key, text, item) => {
            let index = _.findIndex(self.phase_starting_kit, (starting_kit) => {
                return starting_kit.value === key
            })
            self.phase_starting_kit.splice(index, 1)
            self.form_updated()
        }

        self.show_modal = function () {
            $(self.refs.modal).modal('show')

            $('.menu .item').tab('change tab', 'phase_details')

            if (!self.has_initialized_calendars) {

                var date_options = {
                    type: 'date',
                    popupOptions: {
                        position: 'bottom left',
                        lastResort: 'bottom left',
                        hideOnScroll: false
                    },
                    onHide: function () {

                        self.form_updated()
                    }
                }

                var time_options = {
                    type: 'time',
                    popupOptions: {
                        position: 'bottom left',
                        lastResort: 'bottom left',
                        hideOnScroll: false
                    },
                    ampm: false,
                    onHide: function () {

                        self.form_updated()
                    }
                }

                $(self.refs.calendar_start_date).calendar(date_options)

                $(self.refs.calendar_end_date).calendar(date_options)

                $(self.refs.calendar_start_time).calendar(time_options)

                $(self.refs.calendar_end_time).calendar(time_options)

                self.has_initialized_calendars = true
            }

            if(!(self.selected_phase_index === undefined)){

                $(self.refs.calendar_start_date).calendar('set date', self.getDate(self.phases[self.selected_phase_index].start))
                $(self.refs.calendar_end_date).calendar('set date', self.getDate(self.phases[self.selected_phase_index].end))

                $(self.refs.calendar_start_time).calendar('set date', self.getTime(self.phases[self.selected_phase_index].start))
                $(self.refs.calendar_end_time).calendar('set date', self.getTime(self.phases[self.selected_phase_index].end))
            }
        }

        self.close_modal = function () {
            $(self.refs.modal).modal('hide')
        }

        self.formatDateToYYYYMMDD = function(input) {

            var dateObject = new Date(input)

            if (!isNaN(dateObject.getTime())) {

                var year = dateObject.getFullYear()

                var month = (dateObject.getMonth() + 1).toString().padStart(2, '0')

                var day = dateObject.getDate().toString().padStart(2, '0')
                return `${year}-${month}-${day}`
            }
            return input
        }
        self.getDate = function(dt) {

            if (dt != null){
                dt = new Date(dt)
                return dt.toISOString().split('T')[0]
            }else{
                return ""
            }
        }
        self.getTime = function(dt) {

            if (dt != null){
                dt = new Date(dt)
                return dt.toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZone: 'UTC'
                })
            }else{
                return ""
            }
        }
        self.formatDateTo_Y_m_d_T_H_M_S = function(input) {

            var dateObject = new Date(input)

            if (!isNaN(dateObject.getTime())) {

                var year = dateObject.getFullYear()

                var month = (dateObject.getMonth() + 1).toString().padStart(2, '0')

                var day = dateObject.getDate().toString().padStart(2, '0')

                var hours = dateObject.getHours().toString().padStart(2, '0')

                var minutes = dateObject.getMinutes().toString().padStart(2, '0')

                var seconds = dateObject.getSeconds().toString().padStart(2, '0')

                return year + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ':' + seconds
            }
            return input
        }

        self.form_updated = function () {

            var is_valid = true

            if (self.phases.length === 0) {
                is_valid = false
            } else {

                self.phases.forEach(function (phase) {
                    if (!phase.name || !phase.start || phase.tasks.length === 0) {
                        is_valid = false
                    }
                })
                _.forEach(_.range(self.phases.length), i => {
                    if (i !== 0) {
                        let end = Date.parse(self.formatDateToYYYYMMDD(self.phases[i - 1].end))
                        let start = Date.parse(self.formatDateToYYYYMMDD(self.phases[i].start))
                        if (end > start || !end) {
                            let message = `Phase "${_.get(self.phases[i], 'name', i + 1)}" must start after phase "${_.get(self.phases[i - 1], 'name', i)}" ends`
                            if (!self.warnings.includes(message)) {
                                self.warnings.push(message)
                                self.update()
                            }
                            is_valid = false
                        }
                    }
                })
            }

            CODALAB.events.trigger('competition_is_valid_update', 'phases', is_valid)

            if (is_valid) {
                self.warnings = []
                self.update()

                var indexed_phases = _.map(self.phases, (phase, i) => {
                    phase.index = i
                    if (!phase.end) {
                        phase.end = null
                    }
                    return phase
                })
                CODALAB.events.trigger('competition_data_update', {phases: indexed_phases})
            }

            self.form_check_is_valid()
            self.update()
        }

        self.form_check_is_valid = function () {

            var data = get_form_data(self.refs.form)

            self.form_is_valid = !!data.name && !!data.start_date && !!data.start_time && self.phase_tasks.length > 0
        }

        self.clear_form = function () {
            self.selected_phase_index = undefined
            self.phase_tasks = []
            $(self.refs.multiselect).dropdown('clear')
            $(self.refs.public_data_multiselect).dropdown('clear')
            $(self.refs.starting_kit_multiselect).dropdown('clear')

            $(':input', self.refs.form)
                .not('[type="file"]')
                .not('button')
                .not('[readonly]').each(function (i, field) {
                $(field).val('')
            })
            $(self.refs.auto_migrate).prop('checked', false)

            $(self.refs.calendar_start_date).find('input[name="start_date"]').val('')
            $(self.refs.calendar_start_time).find('input[name="start_time"]').val('')
            $(self.refs.calendar_end_date).find('input[name="end_date"]').val('')
            $(self.refs.calendar_end_time).find('input[name="end_time"]').val('')

            $(self.refs.calendar_start_date).calendar('clear');
            $(self.refs.calendar_end_date).calendar('clear');
            $(self.refs.calendar_start_time).calendar('clear');
            $(self.refs.calendar_end_time).calendar('clear');

            self.simple_markdown_editor.value('')

            self.form_updated()
        }

        self.add = function () {
            self.clear_form()
            self.show_modal()
        }

        self.parse_date = function (date) {
            if (!date) {
                return date
            }
            return new Date(Date.parse(date))
        }

        self.edit = function (index) {
            self.selected_phase_index = index
            var phase = self.phases[index]
            self.phase_tasks = phase.tasks
            self.phase_public_data = [phase.public_data]
            self.phase_starting_kit = [phase.starting_kit]

            self.update()
            set_form_data(phase, self.refs.form)
            $(self.refs.auto_migrate).prop('checked', _.get(phase, 'auto_migrate_to_this_phase', false))
            self.refs.hide_output.checked = phase.hide_output
            self.refs.hide_prediction_output.checked = phase.hide_prediction_output
            self.refs.hide_score_output.checked = phase.hide_score_output

            self.simple_markdown_editor.value(self.phases[index].description || '')

            $(self.refs.multiselect)
                .dropdown('change values', _.map(self.phase_tasks, task => {

                    return {
                        value: task.value,
                        text: task.name,
                        name: task.name,
                        selected: true,
                    }
                }))

            if(self.phase_public_data[0] != null){
                $(self.refs.public_data_multiselect)
                    .dropdown('change values', _.map(self.phase_public_data, public_data => {

                        return {
                            value: public_data.value,
                            text: public_data.name,
                            name: public_data.name,
                            selected: true,
                        }
                    }))
            }

            if(self.phase_starting_kit[0] != null){
                $(self.refs.starting_kit_multiselect)
                    .dropdown('change values', _.map(self.phase_starting_kit, starting_kit => {

                        return {

                            value: starting_kit.value,
                            text: starting_kit.name,
                            name: starting_kit.name,
                            selected: true,
                        }
                    }))
            }

            self.show_modal()

            Sortable.create($('.search.dropdown.multiple', self.refs.tasks_select_container)[0])
            Sortable.create($('.search.dropdown.multiple', self.refs.public_data_select_container)[0])
            Sortable.create($('.search.dropdown.multiple', self.refs.starting_kit_select_container)[0])

            self.form_check_is_valid()
            self.update()
        }

        self.delete_phase = function (index) {
            if (confirm("Are you sure you want to delete '" + self.phases[index].name + "'?")) {
                self.phases.splice(index, 1)
                self.form_updated()
            }

        }

        self.save = function () {
            let number_fields = [
                'max_submissions_per_person',
                'max_submissions_per_day',
                'execution_time_limit'
            ]

            let tasks_from_dom = []
            $("#tasks_select_container a").each(function () {
                tasks_from_dom.push($(this).data("value"))
            })
            let sorted_phase_tasks = []
            tasks_from_dom.forEach( function(key) {
                let found = false;
                self.phase_tasks = self.phase_tasks.filter(function (item) {
                    if(!found && item['value'] == key){
                        sorted_phase_tasks.push(item)
                        found = true
                        return false
                    } else
                        return true
                })
            })
            self.phase_tasks = sorted_phase_tasks.slice()

            let public_data_from_dom = []
            $("#public_data_select_container a").each(function () {
                public_data_from_dom.push($(this).data("value"))
            })
            let sorted_phase_public_data = []
            public_data_from_dom.forEach( function(key) {
                let found = false;
                self.phase_public_data = self.phase_public_data.filter(function (item) {
                    if(!found && item['value'] == key){
                        sorted_phase_public_data.push(item)
                        found = true
                        return false
                    } else
                        return true
                })
            })
            self.phase_public_data = sorted_phase_public_data.slice()

            let starting_kit_from_dom = []
            $("#starting_kit_select_container a").each(function () {
                starting_kit_from_dom.push($(this).data("value"))
            })
            let sorted_phase_starting_kit = []
            starting_kit_from_dom.forEach( function(key) {
                let found = false;
                self.phase_starting_kit = self.phase_starting_kit.filter(function (item) {
                    if(!found && item['value'] == key){
                        sorted_phase_starting_kit.push(item)
                        found = true
                        return false
                    } else
                        return true
                })
            })
            self.phase_starting_kit = sorted_phase_starting_kit.slice()

            var data = get_form_data(self.refs.form)

            if (data.start_time == "") {
                data.start_time = "00:00"
            }

            data.start = self.formatDateTo_Y_m_d_T_H_M_S(data.start_date + " " + data.start_time)

            if (data.end_date) {

                if (data.end_time == "") {
                    data.end_time = "00:00"
                }
                data.end = self.formatDateTo_Y_m_d_T_H_M_S(data.end_date + " " + data.end_time)

                if (new Date(data.start) > new Date(data.end)) {
                    toastr.error("End date cannot be earlier than the start date. Please choose a valid date range.")
                    return
                }
            }else{

                data.end = null
            }

            data.tasks = self.phase_tasks
            data.public_data = self.phase_public_data.length === 0 ? null : self.phase_public_data[0]
            data.starting_kit = self.phase_starting_kit.length === 0 ? null : self.phase_starting_kit[0]
            data.task_instances = []
            for(task of self.phase_tasks){
                data.task_instances.push({
                    order_index: data.task_instances.length,
                    task: task.value,
                })
            }
            data.auto_migrate_to_this_phase = $(self.refs.auto_migrate).prop('checked')
            data.hide_output = self.refs.hide_output.checked
            data.hide_prediction_output = self.refs.hide_prediction_output.checked
            data.hide_score_output = self.refs.hide_score_output.checked
            _.forEach(number_fields, field => {
                let str = _.get(data, field)
                if (str) {
                    data[field] = parseInt(str)
                } else {
                    delete data[field]
                }
            })
            if (self.selected_phase_index === undefined) {
                self.phases.push(data)
            } else {

                data.id = self.phases[self.selected_phase_index].id
                self.phases[self.selected_phase_index] = data
            }
            self.close_modal()
        }

        CODALAB.events.on('competition_loaded', function (competition) {
            self.phases = competition.phases
            self.form_updated()
        })
});

riot.tag2('errors', '<ul class="list"> <li each="{error_object, field in opts.errors}"> <strong>{field}:</strong> <span each="{error in error_object}"> <virtual if="{error.constructor != Object}"> {error} </virtual> <virtual if="{error.constructor == Object}"> <errors errors="{error}"></errors> </virtual> </span> </li> </ul>', '', '', function(opts) {
});


riot.tag2('competition-form', '<div class="ui middle aligned stackable grid container"> <div class="row centered"> <div class="twelve wide column"> <div class="ui message error" show="{Object.keys(errors).length > 0}"> <div class="header"> Error(s) saving benchmark </div> <errors errors="{errors}"></errors> </div> <div class="ui six item secondary pointing menu"> <a class="active item" data-tab="competition_details"> <i class="checkmark box icon green" show="{valid_sections.details && !errors.details}"></i> <i class="minus circle icon red" show="{errors.details}"></i> Details </a> <a class="item" data-tab="participation"> <i class="checkmark box icon green" show="{valid_sections.participation && !errors.participation}"></i> <i class="minus circle icon red" show="{errors.participation}"></i> Participation </a> <a class="item" data-tab="pages"> <i class="checkmark box icon green" show="{valid_sections.pages && !errors.pages}"></i> <i class="minus circle icon red" show="{errors.pages}"></i> Pages </a> <a class="item" data-tab="phases"> <i class="checkmark box icon green" show="{valid_sections.phases && !errors.phases}"></i> <i class="minus circle icon red" show="{errors.phases}"></i> Phases </a> <a class="item" data-tab="leaderboard"> <i class="checkmark box icon green" show="{valid_sections.leaderboards && !errors.leaderboards}"></i> <i class="minus circle icon red" show="{errors.leaderboards}"></i> Leaderboard </a> <a class="item" data-tab="collaborators"> <i class="checkmark box icon green" show="{valid_sections.collaborators && !errors.collaborators}"></i> <i class="minus circle icon red" show="{errors.collaborators}"></i> Administrators </a> </div> <div class="ui active tab" data-tab="competition_details"> <competition-details errors="{errors.details}"></competition-details> </div> <div class="ui tab" data-tab="participation"> <competition-participation errors="{errors.participation}"></competition-participation> </div> <div class="ui tab" data-tab="pages"> <competition-pages errors="{errors.pages}"></competition-pages> </div> <div class="ui tab" data-tab="phases"> <competition-phases errors="{errors.phases}"></competition-phases> </div> <div class="ui tab" data-tab="leaderboard"> <competition-leaderboards errors="{errors.details}"></competition-leaderboards> </div> <div class="ui tab" data-tab="collaborators"> <competition-collaborators errors="{errors.details}"></competition-collaborators> </div> </div> </div> <div class="center aligned row"> <div class="column"> <div class="ui checkbox publish-checkbox"> <input type="checkbox" ref="publish"> <label>Publish</label> </div> <button selenium="save4" class="ui primary button {disabled: !are_all_sections_valid()}" onclick="{save}"> Save </button> <button class="ui basic red button discard" onclick="{discard}"> Discard Changes </button> <a if="{opts.competition_id}" class="ui secondary basic button" href="{URLS.COMPETITION_DETAIL(opts.competition_id)}">Back To Competition</a> <help_button if="{!opts.competition_id}" href="https://docs.codabench.org/latest/Organizers/Benchmark_Creation/Competition-Creation-Form/"></help_button> </div> </div> </div>', 'competition-form .publish-checkbox,[data-is="competition-form"] .publish-checkbox{ margin-right: 10px; } competition-form .ui.basic.red.button.discard:hover,[data-is="competition-form"] .ui.basic.red.button.discard:hover{ background-color: #db2828 !important; color: #fff !important; } competition-form .ui.basic.secondary.button:hover,[data-is="competition-form"] .ui.basic.secondary.button:hover{ background-color: #1b1c1d !important; color: #fff !important; }', '', function(opts) {
        var self = this

        self.competition = {}
        self.valid_sections = {
            details: false,
            pages: false,
            participation: false,
            phases: false,
            leaderboards: false,
            collaborators: false
        }
        self.optional_sections = [
            'collaborators',
        ]

        self.required_sections = _.filter(_.keys(self.valid_sections), section => !self.optional_sections.includes(section))

        self.errors = {}

        self.one("mount", function () {

            $('.menu .item', self.root).tab({
                history: true,
                historyType: 'hash',
                onVisible: (tab_name) => {
                    if (_.includes(['participation', 'competition_details'], tab_name)) {
                        CODALAB.events.trigger('update_codemirror')
                    }
                }
            })
            if (!!self.opts.competition_id) {
                self.update_competition_data(self.opts.competition_id)
            }
        })

        self.update_competition_data = (id) => {
            CODALAB.api.get_competition(id)
                .done(function (data) {
                    self.competition = data
                    for(phase of self.competition.phases){
                        phase.task_instances = []
                        for(task of phase.tasks){
                            phase.task_instances.push({
                                task: task.value,
                                phase: phase.id,
                                order_index: phase.task_instances.length,
                            })
                        }
                    }
                    self.refs.publish.checked = self.competition.published
                    CODALAB.events.trigger('competition_loaded', self.competition)
                    self.update()
                })
                .fail(function (response) {
                    toastr.error("Could not find competition");
                });
            self.update()
        }

        self.are_all_sections_valid = function () {
            return _.every(_.map(self.required_sections, section => self.valid_sections[section]))
        }

        self.discard = function () {
            if (confirm('Are you sure you want to discard your changes?')) {
                window.location.href = window.URLS.COMPETITION_MANAGEMENT
            }
        }

        self.save = function () {
            self.competition["queue"] = parseInt(self.competition["queue"])
            if (typeof(self.competition["queue"]) === "NaN" ) {
                self.competition["queue"] = null
            }
            self.competition.published = self.refs.publish.checked
            let previous_index, current_index, next_index;
            let now = new Date()

            let current_phase = _.first(_.filter(self.competition.phases, phase => {
                return new Date(phase.start) < now && now < new Date(phase.end)
            }))

            if (current_phase) {
                current_index = current_phase.index
                previous_index = current_index > 0 ? current_index - 1 : null
                next_index = current_index < self.competition.phases.length - 1 ? current_index + 1 : null
            } else {
                let next_phase = _.first(_.filter(self.competition.phases, phase => {
                    return now < new Date(phase.start) && now < new Date(phase.end)
                }))
                if (next_phase) {
                    next_index = next_phase.index
                    previous_index = next_index > 0 ? next_index - 1 : null
                }
            }

            self.competition.phases = _.map(self.competition.phases, phase => {
                if (phase.task_instances && _.some(phase.task_instances, Object)) {
                    phase.task_instances.task = _.map(phase.task_instances.task, task => task.key || task.value)
                }
                switch (phase.index) {
                    case current_index:
                        phase.status = 'Current'
                        break
                    case previous_index:
                        phase.status = 'Previous'
                        break
                    case next_index:
                        phase.status = 'Next'
                        break
                    default:
                        phase.status = null
                }
                return phase
            })

            self.competition.collaborators = _.map(self.competition.collaborators, collab => collab.id ? collab.id : collab)

            var api_endpoint = self.opts.competition_id ? CODALAB.api.update_competition : CODALAB.api.create_competition
            self.competition_return = JSON.parse(JSON.stringify(self.competition))
            for(phase of self.competition_return.phases){
                for(taskord of phase.task_instances){
                    taskord.phase = phase.id
                }
                phase.tasks = phase.task_instances
                delete phase.task_instances
            }

            api_endpoint(self.competition_return, self.opts.competition_id)
                .done(function (response) {
                    self.errors = {}
                    self.update()
                    toastr.success("Competition saved!")
                    window.location.href = window.URLS.COMPETITION_DETAIL(response.id)
                })
                .fail(function (response) {
                    if (response) {
                        var errors = JSON.parse(response.responseText);

                        var details_section_fields = ['title', 'logo']
                        details_section_fields.forEach(function (field) {
                            if (errors[field]) {

                                errors.details = errors.details || []

                                var new_error_dict = {}
                                new_error_dict[field] = errors[field]

                                errors.details.push(new_error_dict)
                                delete errors[field]
                            }
                        })

                        self.update({errors: errors})
                    }
                    if(self.opts.competition_id){
                        toastr.error("Creation failed, error occurred")
                    }else{
                        toastr.error("Updation failed, error occurred")
                    }
                })

        }

        CODALAB.events.on('competition_data_update', function (data) {
            Object.assign(self.competition, data)
            self.update()
        })
        CODALAB.events.on('competition_is_valid_update', function (name, is_valid) {
            self.valid_sections[name] = is_valid
            self.update()
        })
});

riot.tag2('competition-management', '<div class="ui center aligned grid"> <div class="fourteen wide column"> <h1 style="float: left; display: inline-block;">Benchmark Management</h1> <a class="ui right floated green button" href="{URLS.COMPETITION_UPLOAD}"> <i class="upload icon"></i> Upload </a> <a class="ui right floated green button" href="{URLS.COMPETITION_ADD}"> <i class="add square icon"></i> Create </a> </div> </div> <competition-list></competition-list>', '', '', function(opts) {
        var self = this

});

riot.tag2('public-list', '<div class="page-header"> <h1 class="page-title">Public Benchmarks and Competitions</h1> <div class="action-buttons"> <a class="create-btn" href="{URLS.COMPETITION_ADD}"> <i class="bi bi-plus-square-fill me-1"></i> Create </a> <a class="create-btn" href="{URLS.COMPETITION_UPLOAD}"> <i class="bi bi-cloud-arrow-up-fill me-1"></i> Upload </a> </div> </div> <div class="content-container"> <div class="filters-panel"> <h3>Filters</h3> <div class="filter-group"> <label class="filter-label" for="search-title"><strong>Search by Title</strong></label> <div class="ui input"> <input type="text" id="search-title" oninput="{on_title_input}" placeholder="Enter title..."> </div> </div> <div class="filter-group"> <strong class="filter-label">Order By</strong> <label><input type="radio" name="order" value="popular" onchange="{set_ordering}"> Most popular first</label> <label><input type="radio" name="order" value="recent" onchange="{set_ordering}"> Recently added first</label> <label><input type="radio" name="order" value="with_most_submissions" onchange="{set_ordering}"> With most submissions first</label> </div> <div class="filter-group"> <strong class="filter-label">Your Competitions</strong> <label><input type="checkbox" onchange="{toggle_participating}"> Participating In</label> <label><input type="checkbox" onchange="{toggle_organizing}"> Organizing</label> </div> <div class="filter-group"> <strong class="filter-label">Other filters</strong> <label><input type="checkbox" onchange="{toggle_has_reward}"> Has reward</label> </div> <div class="filter-group" show="{should_show_clear_filters()}"> <button class="clear-filters-btn ui button" onclick="{clear_all_filters}">Clear All Filters</button> </div> </div> <div class="list-panel"> <div id="loading" class="loading-indicator" show="{!competitions}"> <div class="spinner"></div> </div> <div each="{competition in competitions.results}"> <div class="tile-wrapper"> <div class="ui square tiny bordered image img-wrapper"> <img riot-src="{competition.logo_icon ? competition.logo_icon : competition.logo}" loading="lazy"> </div> <a class="link-no-deco" href="../{competition.id}"> <div class="comp-info"> <h4 class="heading">{competition.title}</h4> <p class="comp-description">{pretty_description(competition.description)}</p> <p class="organizer"><em>Organized by: <strong>{competition.created_by}</strong></em></p> </div> </a> <div class="comp-stats"> {pretty_date(competition.created_when)} <div if="{!competition.reward && ! competition.report}" class="ui divider"></div> <div> <span if="{competition.reward}"><img width="30" height="30" src="/static/img/trophy.png"></span> <span if="{competition.report}"><a href="{competition.report}" target="_blank"><img width="30" height="30" src="/static/img/paper.png"></a></span> </div> <strong>{competition.participants_count}</strong> Participants </div> </div> </div> <div class="no-results-message" if="{competitions.results && competitions.results.length === 0}"> <div class="ui warning message"> <div class="header">No competitions found</div> Try changing your filters or search term. </div> </div> <div class="pagination-nav" if="{competitions.next || competitions.previous}"> <button show="{competitions.previous}" onclick="{handle_ajax_pages.bind(this, -1)}" class="float-left ui inline button active">Back</button> <button hide="{competitions.previous}" disabled="disabled" class="float-left ui inline button disabled">Back</button> {current_page} of {Math.ceil(competitions.count/competitions.page_size)} <button show="{competitions.next}" onclick="{handle_ajax_pages.bind(this, 1)}" class="float-right ui inline button active">Next</button> <button hide="{competitions.next}" disabled="disabled" class="float-right ui inline button disabled">Next</button> </div> </div> </div>', 'public-list { width: 100%; } public-list,[data-is="public-list"]{ display: block; margin-bottom: 5px; } public-list .page-header,[data-is="public-list"] .page-header{ display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; } public-list .page-header .action-buttons,[data-is="public-list"] .page-header .action-buttons{ display: flex; gap: 10px; } public-list .page-title,[data-is="public-list"] .page-title{ margin: 0; font-size: 24px; font-weight: bold; color: #1b1b1b; } public-list .create-btn,[data-is="public-list"] .create-btn{ font-size: 14px; padding: 0.5em 1em; background-color: #43637a; color: #fff; text-decoration: none; border-radius: 4px; display: inline-block; cursor: pointer; transition: background-color 0.2s ease; } public-list .create-btn:hover,[data-is="public-list"] .create-btn:hover{ background-color: #2d3f4d; color: #fff; text-decoration: none; } public-list .content-container,[data-is="public-list"] .content-container{ display: flex; width: 100%; } public-list .filters-panel,[data-is="public-list"] .filters-panel{ width: 250px; flex-shrink: 0; border: 1px solid #ddd; padding: 10px; margin-right: 10px; margin-left: 0 !important; background: #f9f9f9; } public-list .filters-panel input[type="text"],[data-is="public-list"] .filters-panel input[type="text"]{ width: 100%; padding: 5px; margin: 5px 0 5px 0; border: 1px solid #ddd; border-radius: 4px; } public-list .filters-panel input[type="radio"],[data-is="public-list"] .filters-panel input[type="radio"],public-list .filters-panel input[type="checkbox"],[data-is="public-list"] .filters-panel input[type="checkbox"]{ margin-right: 5px; } public-list .filter-group,[data-is="public-list"] .filter-group{ margin-bottom: 20px; } public-list .filter-label,[data-is="public-list"] .filter-label{ font-size: 14px; font-weight: bold; display: block; margin-bottom: 8px; } public-list .filter-group label,[data-is="public-list"] .filter-group label{ display: block; font-size: 13px; margin-bottom: 6px; } public-list .list-panel,[data-is="public-list"] .list-panel{ flex-grow: 1; } public-list .pagination-nav,[data-is="public-list"] .pagination-nav{ padding: 10px 0; width: 100%; text-align: center; margin-bottom: 20px; } public-list .float-left,[data-is="public-list"] .float-left{ float: left; } public-list .float-right,[data-is="public-list"] .float-right{ float: right; } public-list .center,[data-is="public-list"] .center{ margin: auto; } public-list .link-no-deco,[data-is="public-list"] .link-no-deco{ all: unset; text-decoration: none; cursor: pointer; width: 100%; } public-list .tile-wrapper,[data-is="public-list"] .tile-wrapper{ border: solid 1px #dcdcdc; display: inline-flex; min-width: 425px; background-color: #fff; transition: all 75ms ease-in-out; color: #909090; width: 100%; margin-bottom: 6px; } public-list .tile-wrapper:hover,[data-is="public-list"] .tile-wrapper:hover{ box-shadow: 0 3px 4px -1px #cac9c9; transition: all 75ms ease-in-out; background-color: #e6edf2; border: solid 1px #a5b7c5; } public-list .tile-wrapper:hover .comp-stats,[data-is="public-list"] .tile-wrapper:hover .comp-stats{ background-color: #344d5e; transition: background-color 75ms ease-in-out; } public-list .img-wrapper,[data-is="public-list"] .img-wrapper{ padding: 5px; align-self: center; } public-list .img-wrapper img,[data-is="public-list"] .img-wrapper img{ max-height: 60px !important; max-width: 60px !important; margin: 0 auto; } public-list .comp-info,[data-is="public-list"] .comp-info{ width: calc(100% - 140px - 80px); } public-list .comp-info .heading,[data-is="public-list"] .comp-info .heading{ text-align: left; padding: 5px; color: #1b1b1b; margin-bottom: 0; } public-list .comp-info .comp-description,[data-is="public-list"] .comp-info .comp-description{ text-align: left; font-size: 13px; line-height: 1.15em; margin: 0.35em; } public-list .organizer,[data-is="public-list"] .organizer{ font-size: 13px; text-align: left; margin: 0.35em; } public-list .comp-stats,[data-is="public-list"] .comp-stats{ background: #405e73; color: #e8e8e8; padding: 10px; text-align: center; font-size: 12px; width: 140px; } public-list .loading-indicator,[data-is="public-list"] .loading-indicator{ display: flex; align-items: center; padding: 20px; width: 100%; margin: 0 auto; } public-list .spinner,[data-is="public-list"] .spinner{ border: 4px solid rgba(0,0,0,0.1); width: 36px; height: 36px; border-radius: 50%; border-top-color: #3498db; animation: spin 1s ease-in-out infinite; } @-moz-keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } } @-webkit-keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } } @-o-keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } } @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }', '', function(opts) {
    var self = this
    self.search_timer = null
    self.competitions = {}

    self.filter_state = {
        search: '',
        ordering: '',
        participating_in: false,
        organizing: false,
        has_reward: false
    }

    self.on_title_input = function(e) {
        const value = e.target.value
        self.filter_state.search = value
        self.update()

        if (self.search_timer) {
            clearTimeout(self.search_timer)
        }

        self.search_timer = setTimeout(() => {
            self.update_competitions_list(1)
        }, 1000)
    }

    self.set_ordering = function (e) {
        self.filter_state.ordering = e.target.value
        self.update()
        self.update_competitions_list(1)
    }

    self.toggle_participating = function(e) {
        self.filter_state.participating_in = e.target.checked
        self.update()
        self.update_competitions_list(1)
    }

    self.toggle_organizing = function(e) {
        self.filter_state.organizing = e.target.checked
        self.update()
        self.update_competitions_list(1)
    }

    self.toggle_has_reward = function(e) {
        self.filter_state.has_reward = e.target.checked
        self.update()
        self.update_competitions_list(1)
    }

    self.should_show_clear_filters = function () {
        const { search, ordering, participating_in, organizing, has_reward } = self.filter_state
        return search || ordering || participating_in || organizing || has_reward
    }

    self.clear_all_filters = function() {
        self.filter_state = {
            search: '',
            ordering: '',
            participating_in: false,
            organizing: false,
            has_reward: false
        }

        document.getElementById('search-title').value = ''
        document.querySelectorAll('input[name="order"]').forEach(r => r.checked = false)
        document.querySelectorAll('input[type="checkbox"]').forEach(c => c.checked = false)

        self.update_competitions_list(1)
    }

    self.one("mount", function () {
        const urlParams = new URLSearchParams(window.location.search)

        if (urlParams.has("ordering")) {
            const ordering = urlParams.get("ordering")
            if (["popular", "recent"].includes(ordering)) {
            self.filter_state.ordering = ordering

            const radio = document.querySelector(`input[name="order"][value="${ordering}"]`)
            if (radio) radio.checked = true
            }
        }

      self.update_competitions_list(self.get_url_page_number_or_default())
    })

    self.handle_ajax_pages = function (num) {
        $('.pagination-nav > button').prop('disabled', true)
        self.update_competitions_list(self.get_url_page_number_or_default() + num)
    }

    self.update_competitions_list = function (num) {

        self.current_page = num;
        $('#loading').show();
        $('.pagination-nav').hide();

        function handleSuccess(response) {
            self.competitions = response;
            $('#loading').hide();
            $('.pagination-nav').show();
            history.pushState("", document.title, "?page=" + self.current_page);
            $('.pagination-nav > button').prop('disabled', false);
            self.update();
        }

        return CODALAB.api.get_public_competitions({
            "page": self.current_page,
            "search": self.filter_state.search,
            "ordering": self.filter_state.ordering,
            "participating_in": self.filter_state.participating_in,
            "organizing": self.filter_state.organizing,
            "has_reward": self.filter_state.has_reward
        })
        .fail(function (resp) {
            $('#loading').hide()
            $('.pagination-nav').show()

            let message = "Could not load competition list"
            if (resp.responseJSON && resp.responseJSON.detail) {
                message = resp.responseJSON.detail
            } else if (resp.responseText) {
                try {
                    const json = JSON.parse(resp.responseText)
                    if (json.detail) {
                        message = json.detail
                    }
                } catch (_) {

                    message = resp.responseText;
                }
            }
            toastr.error(message)
        })
        .done(handleSuccess);
    };

    self.get_array_length = function (arr) {
        return arr === undefined ? 0 : arr.length
    }

    self.pretty_date = function (date_string) {
        return !!date_string ? luxon.DateTime.fromISO(date_string).toLocaleString(luxon.DateTime.DATE_FULL) : ''
    }

    self.pretty_description = function (description) {
        return description.substring(0, 120) + (description.length > 120 ? '...' : '') || ''
    }

    self.get_url_page_number_or_default = function () {
        let urlParams = new URLSearchParams(window.location.search)
        if (urlParams.has('page')) {
            let pagenum = parseInt(urlParams.get('page'))
        if (pagenum < 1) {
            history.pushState("test", document.title, "?page=1")
            return 1
        } else {
            return pagenum
        }
        } else {
            history.pushState("test", document.title, "?page=1")
            return 1
        }
    }

    $(window).on('popstate', function () {
        self.update_competitions_list(self.get_url_page_number_or_default())
    })
});

riot.tag2('competition-tile', '<div class="tile-wrapper {is_featured ? \'featured\' : \'\'}"> <div class="ui square tiny bordered image img-wrapper"> <img riot-src="{logo_icon ? logo_icon : logo}"> </div> <a class="link-no-deco" href="./competitions/{id}"> <div class="comp-info"> <h4 class="heading"> {title} <span if="{is_featured}" class="featured-badge">Featured</span> </h4> <p class="comp-description"> {pretty_description(description)} </p> <p class="organizer"> <em>Organized by: <strong>{created_by}</strong></em> </p> </div> </a> <div class="comp-stats" id="compStats"> {pretty_date(created_when)} <div if="{!reward && !report}" class="ui divider"></div> <div> <span if="{reward}"><img width="30" height="30" src="/static/img/trophy.png"></span> <span if="{report}"><a href="{report}" target="_blank"><img width="30" height="30" src="/static/img/paper.png"></a></span> </div> <strong>{participants_count}</strong> Participants </div> </div>', 'competition-tile,[data-is="competition-tile"]{ display: block; margin-bottom: 5px; } competition-tile .link-no-deco,[data-is="competition-tile"] .link-no-deco{ all: unset; text-decoration: none; cursor: pointer; } competition-tile .tile-wrapper,[data-is="competition-tile"] .tile-wrapper{ border: solid 1px #dcdcdc; display: inline-grid; grid-template-columns: 0.1fr 3fr 1.3fr; min-width: 425px; background-color: #fff; transition: all 75ms ease-in-out; color: #909090; width: 100%; } competition-tile .tile-wrapper:hover,[data-is="competition-tile"] .tile-wrapper:hover{ box-shadow: 0 3px 4px -1px #9c9c9c; transition: all 75ms ease-in-out; background-color: #e8e8e8; border: solid 1px #b9b9b9; } competition-tile .tile-wrapper:hover .comp-stats,[data-is="competition-tile"] .tile-wrapper:hover .comp-stats{ background-color: #344d5e; transition: background-color 75ms ease-in-out; } competition-tile .tile-wrapper.featured,[data-is="competition-tile"] .tile-wrapper.featured{ border: solid 2px #ffd700; background-color: #fffbea ; box-shadow: 0 0 10px rgba(255,215,0,0.6); } competition-tile .img-wrapper,[data-is="competition-tile"] .img-wrapper{ padding: 5px; align-self: center; } competition-tile .img-wrapper img,[data-is="competition-tile"] .img-wrapper img{ max-height: 60px !important; max-width: 60px !important; margin: 0 auto; } competition-tile .comp-info .heading,[data-is="competition-tile"] .comp-info .heading{ text-align: left; padding: 5px; color: #1b1b1b; margin-bottom: 0; } competition-tile .featured-badge,[data-is="competition-tile"] .featured-badge{ background-color: #ffd700; color: #222; font-size: 12px; font-weight: 600; padding: 2px 7px; border-radius: 5px; margin-left: 8px; display: inline-block; } competition-tile .comp-info .comp-description,[data-is="competition-tile"] .comp-info .comp-description{ text-align: left; font-size: 13px; line-height: 1.15em; margin: 0.35em; } competition-tile .comp-stats,[data-is="competition-tile"] .comp-stats{ background: #405e73; color: #e8e8e8; padding: 10px; text-align: center; font-size: 12px; } competition-tile .organizer,[data-is="competition-tile"] .organizer{ font-size: 13px; text-align: left; margin: 0.35em; }', '', function(opts) {
        var self = this

        self.pretty_date = function (date_string) {
            if (!!date_string) {
                return luxon.DateTime.fromISO(date_string).toLocaleString(luxon.DateTime.DATE_FULL)
            } else {
                return ''
            }
        }

        self.pretty_description = function(description){
            return description.substring(0,90) + (description.length > 90 ? '...' : '') || ''
        }

});

riot.tag2('competition-card', '<div class="image"> <img src="https://i.imgur.com/n2XUSxU.png"> </div> <div class="content"> <a class="header">{title}</a> <div class="meta"> <span class="date">Joined in 2013</span> </div> <div class="description"> Kristy is an art director living in New York. </div> </div> <div class="extra content"> <a> <i class="user icon"></i> 22 Friends </a> </div>', 'competition-card :self,[data-is="competition-card"] :self{ display: block; }', '', function(opts) {
});

riot.tag2('front-page-competitions', '<div class="ui two column grid"> <div class="eight wide column"> <div class="ui large header"> Popular Benchmarks </div> <div class="loader-container popular"> <div class="lds-ring"> <div></div> <div></div> <div></div> <div></div> </div> </div> <competition-tile each="{popular_competitions}"></competition-tile> <a class="show-more" href="/competitions/public/?ordering=popular">Show more</a> </div> <div class="eight wide column"> <div class="ui large header"> Recent Benchmarks </div> <div class="loader-container popular"> <div class="lds-ring"> <div></div> <div></div> <div></div> <div></div> </div> </div> <competition-tile each="{recent_competitions}"></competition-tile> <a class="show-more" href="/competitions/public/?ordering=recent">Show more</a> </div> </div>', 'front-page-competitions { margin: 3em 1.5em; } front-page-competitions .show-more,[data-is="front-page-competitions"] .show-more{ display: block; width: fit-content; margin: 20px auto; padding: 10px 20px; background-color: #4a6778; color: #fff; text-align: center; border-radius: 5px; font-size: 1.1em; text-decoration: none; transition: background-color 0.3s, transform 0.3s; } front-page-competitions .show-more:hover,[data-is="front-page-competitions"] .show-more:hover{ background-color: #467799; transform: scale(1.05); text-decoration: none; } front-page-competitions .sub-header-link,[data-is="front-page-competitions"] .sub-header-link{ line-height: 0.25em; } front-page-competitions .view-all-comps,[data-is="front-page-competitions"] .view-all-comps{ font-size: 0.5em; font-weight: 100; } front-page-competitions .view-all-comps:hover,[data-is="front-page-competitions"] .view-all-comps:hover{ text-decoration: underline; }', '', function(opts) {
        var self = this

        self.one("mount", function () {
            self.get_frontpage_competitions()
        })

        self.get_frontpage_competitions = function (data) {
            return CODALAB.api.get_front_page_competitions(data)
                .fail(function (response) {
                    toastr.error("Could not load competition list")
                })
                .done(function (data) {
                    self.recent_competitions = data["recent_comps"]
                    self.popular_competitions = data["popular_comps"]
                    self.update()
                    $('.loader-container').hide()
                })
        }
});

riot.tag2('competition-upload', '<div class="ui grid container"> <div class="eight wide column centered form-empty"> <div class="ui segment"> <div class="flex-header"> <h1 class="ui header">Benchmark upload</h1> <help_button href="https://docs.codabench.org/latest/Organizers/Benchmark_Creation/Competition-Creation-Bundle/" tooltip="More information on bundle creation"> </help_button> </div> <form hide="{listening_for_status || resulting_competition || resulting_details}" class="ui form coda-animated {error: errors}" ref="form" enctype="multipart/form-data"> <input-file name="data_file" ref="data_file" error="{errors.data_file}" accept=".zip"></input-file> </form> <div hide="{listening_for_status || resulting_competition || resulting_details}" class="ui indicating progress" ref="progress"> <div class="bar"> <div class="progress">{upload_progress}%</div> </div> </div> <div class="ui message error" show="{Object.keys(errors).length > 0}"> <div class="header"> Error(s) uploading competition bundle </div> <ul class="list"> <li each="{error, field in errors}"> <strong>{field}:</strong> {error} </li> </ul> </div> <div ref="task_status_display" class="coda-animated-slow task-status-display"> <div class="ui huge text centered inline loader {active: listening_for_status}">Unpacking...</div> <div class="ui success message" show="{resulting_competition}"> <div class="header"> Competition created! </div> <p><a href="{URLS.COMPETITION_DETAIL(resulting_competition)}">View</a> your new competition.</p> </div> <div class="ui negative message" show="{!listening_for_status && !resulting_competition}"> <div class="header"> Creation failed </div> <p>{resulting_details}</p> </div> </div> </div> </div> </div>', 'competition-upload,[data-is="competition-upload"]{ padding: 50px 0; } competition-upload h1.header,[data-is="competition-upload"] h1.header{ margin-bottom: 35px !important; } competition-upload .task-status-display,[data-is="competition-upload"] .task-status-display{ max-height: 0; overflow: hidden; } competition-upload .loader,[data-is="competition-upload"] .loader{ padding-bottom: 20px; } competition-upload .flex-header,[data-is="competition-upload"] .flex-header{ display: flex; flex-direction: row; justify-content: space-between; }', '', function(opts) {
        var self = this
        self.mixin(ProgressBarMixin)

        self.errors = {}
        self.listening_for_status = false
        self.resulting_competition = undefined

        self.one('mount', function() {

            $(self.refs.data_file.refs.file_input).on('change', self.check_form)
        })

        self.clear_form = function () {

            $(':input', self.root)
                .not(':button, :submit, :reset, :hidden')
                .val('')

            self.errors = {}
            self.update()
        }

        self.check_form = function (event) {
            if (event) {
                event.preventDefault()
            }

            var data_file = self.refs.data_file.refs.file_input.value

            if(data_file === undefined || !data_file.endsWith('.zip')) {
                toastr.warning("Please select a .zip file to upload")
                setTimeout(self.clear_form, 1)
                return
            }

            self.clear_form()

            self.prepare_upload(self.upload)()
        }
        self.upload = function () {

            var metadata = {
                type: 'competition_bundle'
            }
            var data_file = self.refs.data_file.refs.file_input.files[0]

            CODALAB.api.create_dataset(metadata, data_file, self.file_upload_progress_handler)
                .done(function (data) {
                    setTimeout(function() {
                        self.status_listening_loop(data.status_id)
                    }, 501)
                })
                .fail(function (response) {
                    if (response) {
                        try {
                            var errors = JSON.parse(response.responseText)

                            Object.keys(errors).map(function (key, index) {
                                errors[key] = errors[key].join('; ')
                            })

                            self.update({errors: errors})
                        } catch (e) {

                        }
                    }
                    toastr.error("Creation failed, error occurred")
                })
                .always(function () {
                    setTimeout(self.hide_progress_bar, 500)
                })
        }

        self.status_listening_loop = function(id) {

            self.refs.task_status_display.style.maxHeight = '1000px'
            self.listening_for_status = true
            self.update()

            setTimeout(function() {
                CODALAB.api.get_competition_creation_status(id)
                    .done(function(data){
                        var status = data.status.toLowerCase()
                        if(status === "finished" || status === "failed") {
                            self.resulting_details = data.details
                            self.resulting_competition = data.resulting_competition
                            self.listening_for_status = false
                            self.update()
                        } else {

                            self.status_listening_loop(id)
                        }
                    })
                    .fail(function(data) {
                        self.status_listening_loop(id)
                    })

            }, 2000)
        }
});

riot.tag2('dataset-create', '<div class="ui container dataset-container"> <h2 class="ui header">Create Dataset</h2> <form class="ui form {error: errors}" ref="form" enctype="multipart/form-data"> <div class="ui message error" show="{Object.keys(errors).length > 0}"> <div class="header"> Errorn (s) creating dataset </div> <ul class="list"> <li each="{error, field in errors}"> <strong>{field}:</strong> {error} </li> </ul> </div> <div class="field required"> <label>Name</label> <input id="dataset-name" type="text" name="name" ref="name" required placeholder="Enter dataset name" error="{errors.name}"> </div> <div class="field required"> <label>Description</label> <textarea id="dataset-description" name="description" ref="description" rows="4" required placeholder="Enter a description..." error="{errors.description}"></textarea> </div> <div class="field required"> <label>Type</label> <select id="dataset-type" class="ui dropdown" name="type" ref="type" required error="{errors.type}"> <option value="public_data" selected>Public Data</option> <option value="input_data">Input Data</option> <option value="reference_data">Reference Data</option> </select> <p class="form-note"> NOTE: Only datasets with type: public data are listed on the Public Datasets page; input and reference data appear only in your Resources page. </p> </div> <div class="field"> <label>Make Public</label> <div class="ui checkbox"> <input type="checkbox" id="dataset-public" name="is_public" ref="is_public"> <label for="dataset-public">List on Public Datasets page</label> </div> <p class="form-note"> NOTE: Only datasets that are marked `public` are listed on the Public Datasets. </p> </div> <div class="field required"> <label>License</label> <select id="dataset-license" class="ui dropdown" name="license" ref="license" onchange="{on_license_change}" error="{errors.license}"> <option value="">Select a License</option> <option value="CC0-1.0">Creative Commons Zero (CC0) 1.0</option> <option value="CC-BY-4.0">Creative Commons Attribution (CC BY) 4.0</option> <option value="CC-BY-SA-4.0">Creative Commons Attribution-ShareAlike (CC BY-SA) 4.0</option> <option value="CC-BY-NC-4.0">Creative Commons Attribution-NonCommercial (CC BY-NC) 4.0 <option value="ODC-By">Open Data Commons Attribution License (ODC-By)</option> <option value="ODbL-1.0">Open Database License (ODbL) 1.0</option> <option value="MIT">MIT License</option> <option value="Apache-2.0">Apache License 2.0</option> <option value="GPL-3.0">GNU General Public License v3.0</option> <option value="BSD-3-Clause">BSD 3-Clause License</option> <option value="Research-Only">Research Use Only</option> <option value="N/A">N/A</option> <option value="Other">Other</option> </select> </div> <div class="field" if="{show_custom_license}"> <label>Custom License Name</label> <input id="custom-license" type="text" name="custom_license" ref="custom_license" placeholder="Enter license name" error="{errors.custom_license}"> </div> <div class="field required"> <label>Attach Dataset File (.zip only)</label> <input-file name="data_file" ref="data_file" error="{errors.data_file}" accept=".zip" required></input-file> </div> <button type="submit" class="ui button bg-codabench" onclick="{check_form}"> <i class="bi bi-cloud-arrow-up-fill"></i> Submit Dataset </button> </form> </div>', 'dataset-create .dataset-container,[data-is="dataset-create"] .dataset-container{ max-width: 700px; margin: 2rem auto; padding: 2rem; background: #fff; border: 1px solid #ddd; border-radius: 8px; } dataset-create .form-note,[data-is="dataset-create"] .form-note{ font-style: italic; color: #888; font-size: 0.9rem; margin-top: 0.5rem; } dataset-create input[type="file"],[data-is="dataset-create"] input[type="file"]{ border: 1px solid #ccc; padding: 0.75rem; border-radius: 4px; } dataset-create .bg-codabench,[data-is="dataset-create"] .bg-codabench{ background-color: #43637a !important; color: #fff !important; } dataset-create .bg-codabench:hover,[data-is="dataset-create"] .bg-codabench:hover{ background-color: #2d3f4d !important; }', '', function(opts) {
    var self = this
    self.mixin(ProgressBarMixin)

    self.errors = {}
    self.show_custom_license = false

    self.on_license_change = function (e) {
      self.show_custom_license = e.target.value === 'Other'
      self.update()
    }

    self.check_form = function (e) {
      e.preventDefault()

      self.file_upload_progress_handler(undefined)

      self.errors = {}
      var validate_data = get_form_data(self.refs.form)

      var required_fields = ['name', 'description','type', 'license', 'data_file']
      required_fields.forEach(field => {
        if (validate_data[field].trim() === '') {
            self.errors[field] = "This field is required"
        }
      })

      if (validate_data['license'] === 'Other') {
        if (!validate_data['custom_license'] || validate_data['custom_license'].trim() === '') {
          self.errors['custom_license'] = "Please specify a custom license name"
        }
      }

      if (Object.keys(self.errors).length > 0) {

        self.update()
        return
      }

      self.prepare_upload(self.upload)()
    }

    self.upload = function () {

      var metadata = get_form_data(self.refs.form)

      delete metadata.data_file

      metadata.is_public = self.refs.is_public.checked

      var data_file = self.refs.data_file.refs.file_input.files[0]

      CODALAB.api.create_dataset(metadata, data_file, self.file_upload_progress_handler)
        .done(function (data) {
            toastr.success("Dataset successfully uploaded!")
            self.clear_form()
            setTimeout(function () {
              self.redirect_to_public_or_resources()
            }, 2000)
        })
        .fail(function (response) {
            if (response) {
                try {
                    var errors = JSON.parse(response.responseText)

                    Object.keys(errors).map(function (key, index) {
                        errors[key] = errors[key].join('; ')
                    })

                    self.update({errors: errors})
                } catch (e) {

                }
            }
            toastr.error("Creation failed, error occurred")
        })
        .always(function () {
            self.hide_progress_bar()
        })
    }

    self.clear_form = function () {

      self.refs.form.reset()

      self.errors = {}
      self.show_custom_license = false

      self.update()
    }

    self.redirect_to_public_or_resources = function () {
      const urlParams = new URLSearchParams(window.location.search)
      const from = urlParams.get('from')

      if (from === 'public') {
          window.location.href = '/datasets/public/'
      } else {
          window.location.href = '/datasets/'
      }
    }
});

riot.tag2('dataset-detail', '<div class="ui container dataset-container"> <h2 class="ui header">Dataset Details</h2> <table class="ui celled table"> <tbody if="{dataset}"> <tr> <td><strong>Name</strong></td> <td>{dataset.name}</td> </tr> <tr> <td><strong>Description</strong></td> <td>{dataset.description}</td> </tr> <tr> <td><strong>Owner</strong></td> <td>{dataset.created_by}</td> </tr> <tr> <td><strong>Uploaded Date</strong></td> <td>{pretty_date(dataset.created_when)}</td> </tr> <tr> <td><strong>License</strong></td> <td>{dataset.license}</td> </tr> <tr> <td><strong>Downloads</strong></td> <td>{dataset.downloads}</td> </tr> <tr> <td><strong>Verified</strong></td> <td if="{dataset.is_verified}"><i class="bi bi-check-circle-fill green"></td> <td if="{!dataset.is_verified}">No</td> </tr> <tr> <td><strong>File Size</strong></td> <td>{pretty_bytes(dataset.file_size)}</td> </tr> <tr> <td colspan="2"> <a class="ui button small primary" target="_blank" href="{URLS.DATASET_DOWNLOAD_BY_PK(dataset.id)}"> <i class="bi bi-file-earmark-arrow-down-fill"></i> Download </a> </td> </tr> </tbody> </table> </div>', 'dataset-detail .dataset-container,[data-is="dataset-detail"] .dataset-container{ max-width: 700px; margin: 2rem auto; padding: 2rem; background: #fff; border: 1px solid #ddd; border-radius: 8px; } dataset-detail .bg-codabench,[data-is="dataset-detail"] .bg-codabench{ background-color: #43637a !important; color: #fff !important; } dataset-detail .bg-codabench:hover,[data-is="dataset-detail"] .bg-codabench:hover{ background-color: #2d3f4d !important; } dataset-detail table.ui.celled.table td,[data-is="dataset-detail"] table.ui.celled.table td{ vertical-align: top; } dataset-detail .green,[data-is="dataset-detail"] .green{ color: #009022; }', '', function(opts) {
    var self = this
    self.dataset = {
        id: opts.id,
        name: opts.name,
        description: opts.description,
        license: opts.license,
        is_verified: opts.is_verified === 'True',
        created_when: opts.created_when,
        created_by: opts.created_by,
        file_size: opts.file_size,
        downloads: opts.downloads,
    }

    self.on('mount', () => {
        self.update()
    })

    self.pretty_date = date => luxon.DateTime.fromISO(date).toLocaleString(luxon.DateTime.DATE_FULL)

});

riot.tag2('help_button', '<a class="ui mini circular icon button" data-tooltip="{opts.tooltip || \'Help\'}" data-position="{opts.tooltip_position || \'top center\'}" href="{opts.href}" target="_blank"> <i class="question icon"></i> </a>', '', '', function(opts) {
});

riot.tag2('data-management', '<div class="ui icon input"> <input type="text" placeholder="Search..." ref="search" onkeyup="{filter.bind(this, undefined)}"> <i class="search icon"></i> </div> <select class="ui dropdown" ref="type_filter" onchange="{filter.bind(this, undefined)}"> <option value="">Filter By Type</option> <option value="-">----</option> <option each="{type in types}" riot-value="{type}">{_.startCase(type)}</option> </select> <div class="ui checkbox" onclick="{filter.bind(this, undefined)}"> <label>Show Auto Created</label> <input type="checkbox" ref="auto_created"> </div> <div class="ui checkbox inline-div" onclick="{filter.bind(this, undefined)}"> <label>Show Public</label> <input type="checkbox" ref="show_public"> </div> <button class="ui green right floated labeled icon button" onclick="{show_creation_modal}"> <i selenium="add-dataset" class="plus icon"></i> Add Dataset/Program </button> <button class="ui red right floated labeled icon button {disabled: marked_datasets.length === 0}" onclick="{delete_datasets}"> <i class="icon delete"></i> Delete Selected </button> <table id="datasetsTable" class="ui {selectable: datasets.length > 0} celled compact sortable table"> <thead> <tr> <th>File Name</th> <th width="175px">Type</th> <th width="175px">Size</th> <th width="125px">Uploaded</th> <th width="60px" class="no-sort">In Use</th> <th width="60px" class="no-sort">Public</th> <th width="50px" class="no-sort">Delete?</th> <th width="25px" class="no-sort"></th> </tr> </thead> <tbody> <tr each="{dataset, index in datasets}" class="dataset-row" onclick="{show_info_modal.bind(this, dataset)}"> <td>{dataset.name}</td> <td>{dataset.type}</td> <td>{pretty_bytes(dataset.file_size)}</td> <td>{timeSince(Date.parse(dataset.created_when))} ago</td> <td class="center aligned"> <i class="checkmark box icon green" show="{dataset.in_use.length > 0}"></i> </td> <td class="center aligned"> <i class="checkmark box icon green" show="{dataset.is_public}"></i> </td> <td class="center aligned"> <button show="{dataset.created_by === CODALAB.state.user.username}" class="ui mini button red icon" onclick="{delete_dataset.bind(this, dataset)}"> <i class="icon delete"></i> </button> </td> <td class="center aligned"> <div show="{dataset.created_by === CODALAB.state.user.username}" class="ui fitted checkbox"> <input type="checkbox" name="delete_checkbox" onclick="{mark_dataset_for_deletion.bind(this, dataset)}"> <label></label> </div> </td> </tr> <tr if="{datasets.length === 0}"> <td class="center aligned" colspan="6"> <em>No Datasets Yet!</em> </td> </tr> </tbody> <tfoot> <tr> <th colspan="8" if="{datasets.length > 0}"> <div class="ui right floated pagination menu" if="{datasets.length > 0}"> <a show="{!!_.get(pagination, \'previous\')}" class="icon item" onclick="{previous_page}"> <i class="left chevron icon"></i> </a> <div class="item"> <label>{page}</label> </div> <a show="{!!_.get(pagination, \'next\')}" class="icon item" onclick="{next_page}"> <i class="right chevron icon"></i> </a> </div> </th> </tr> </tfoot> </table> <div ref="info_modal" class="ui modal"> <div class="header"> {selected_row.name} </div> <div class="content"> <h3>Details</h3> <table class="ui basic table"> <thead> <tr> <th>Key</th> <th>Created By</th> <th>Created</th> <th>Type</th> <th>Public</th> </tr> </thead> <tbody> <tr> <td>{selected_row.key}</td> <td><a href="/profiles/user/{selected_row.created_by}/" target="_blank">{selected_row.owner_display_name}</a></td> <td>{pretty_date(selected_row.created_when)}</td> <td>{_.startCase(selected_row.type)}</td> <td>{_.startCase(selected_row.is_public)}</td> </tr> </tbody> </table> <virtual if="{!!selected_row.description}"> <div>Description:</div> <div class="ui segment"> {selected_row.description} </div> </virtual> <div show="{!!_.get(selected_row.in_use, \'length\')}"><strong>Used by:</strong> <div class="ui bulleted list"> <div class="item" each="{comp in selected_row.in_use}"> <a href="{URLS.COMPETITION_DETAIL(comp.pk)}" target="_blank">{comp.title}</a> </div> </div> </div> </div> <div class="actions"> <button show="{selected_row.created_by === CODALAB.state.user.username}" class="ui primary icon button" onclick="{toggle_is_public}"> <i class="share icon"></i> {selected_row.is_public ? ⁗Make Private⁗ : ⁗Make Public⁗} </button> <a href="{URLS.DATASET_DOWNLOAD(selected_row.key)}" class="ui green icon button"> <i class="download icon"></i>Download File </a> <button class="ui cancel button">Close</button> </div> </div> <div ref="dataset_creation_modal" class="ui modal"> <div class="header">Add Dataset/Program Form</div> <div class="content"> <div class="ui message error" show="{Object.keys(errors).length > 0}"> <div class="header"> Error(s) creating dataset </div> <ul class="list"> <li each="{error, field in errors}"> <strong>{field}:</strong> {error} </li> </ul> </div> <form class="ui form coda-animated {error: errors}" ref="form"> <input-text selenium="scoring-name" name="name" ref="name" error="{errors.name}" placeholder="Name"></input-text> <input-text selenium="scoring-desc" name="description" ref="description" error="{errors.description}" placeholder="Description"></input-text> <div class="field {error: errors.type}"> <select selenium="type" id="type_of_data" name="type" ref="type" class="ui dropdown"> <option value="">Type</option> <option value="-">----</option> <option each="{type in types}" riot-value="{type}">{_.startCase(type)}</option> </select> </div> <input-file selenium="file" name="data_file" ref="data_file" error="{errors.data_file}" accept=".zip"></input-file> </form> <div class="ui indicating progress" ref="progress"> <div class="bar"> <div class="progress">{upload_progress}%</div> </div> </div> </div> <div class="actions"> <button class="ui blue icon button" onclick="{check_form}"> <i selenium="upload" class="upload icon"></i> Upload </button> <button class="ui basic red cancel button">Cancel</button> </div> </div>', 'data-management .dataset-row:hover,[data-is="data-management"] .dataset-row:hover{ cursor: pointer; }', '', function(opts) {
        var self = this
        self.mixin(ProgressBarMixin)

        self.types = [
            "ingestion_program",
            "input_data",
            "public_data",
            "reference_data",
            "scoring_program",
            "starting_kit",
        ]
        self.errors = []
        self.datasets = []
        self.selected_row = {}
        self.marked_datasets = []

        self.upload_progress = undefined

        self.page = 1

        self.one("mount", function () {
            $(".ui.dropdown", self.root).dropdown()
            $(".ui.checkbox", self.root).checkbox()
            $('#datasetsTable').tablesort()
            self.update_datasets()
        })

        self.show_info_modal = function (row, e) {

            if (e.target.type === 'checkbox') {
                return
            }
            self.selected_row = row
            self.update()
            $(self.refs.info_modal).modal('show')
        }

        self.show_creation_modal = function () {
            $(self.refs.dataset_creation_modal).modal('show')
        }

        self.pretty_date = date => luxon.DateTime.fromISO(date).toLocaleString(luxon.DateTime.DATE_FULL)

        self.filter = function (filters) {
            let type = $(self.refs.type_filter).val()
            filters = filters || {}
            _.defaults(filters, {
                type: type === '-' ? '' : type,
                search: $(self.refs.search).val(),
                page: 1,
            })
            self.page = filters.page
            self.update_datasets(filters)
        }

        self.next_page = function () {
            if (!!self.pagination.next) {
                self.page += 1
                self.filter({page: self.page})
            } else {
                alert("No valid page to go to!")
            }
        }
        self.previous_page = function () {
            if (!!self.pagination.previous) {
                self.page -= 1
                self.filter({page: self.page})
            } else {
                alert("No valid page to go to!")
            }
        }

        self.update_datasets = function (filters) {
            filters = filters || {}
            filters.was_created_by_competition = $(self.refs.auto_created).prop('checked')
            filters._public = $(self.refs.show_public).prop('checked')
            filters._type = "dataset"
            CODALAB.api.get_datasets(filters)
                .done(function (data) {
                    self.datasets = data.results
                    self.pagination = {
                        "count": data.count,
                        "next": data.next,
                        "previous": data.previous
                    }
                    self.update()
                })
                .fail(function (response) {
                    toastr.error("Could not load datasets...")
                })
        }

        self.delete_dataset = function (dataset, e) {
            if (confirm(`Are you sure you want to delete '${dataset.name}'?`)) {
                CODALAB.api.delete_dataset(dataset.id)
                    .done(function () {
                        self.update_datasets()
                        toastr.success("Dataset deleted successfully!")
                        CODALAB.events.trigger('reload_quota_cleanup')
                    })
                    .fail(function (response) {
                        toastr.error(response.responseJSON['error'])
                    })
            }
            event.stopPropagation()
        }

        self.delete_datasets = function () {
            if (confirm(`Are you sure you want to delete multiple datasets?`)) {
                CODALAB.api.delete_datasets(self.marked_datasets)
                    .done(function () {
                        self.update_datasets()
                        toastr.success("Dataset deleted successfully!")
                        self.marked_datasets = []
                        CODALAB.events.trigger('reload_quota_cleanup')
                    })
                    .fail(function (response) {
                        for (e in response.responseJSON) {
                            toastr.error(`${e}: '${response.responseJSON[e]}'`)
                        }
                    })
            }
            event.stopPropagation()
        }

        self.clear_form = function () {

            $(':input', self.refs.form)
                .not(':button, :submit, :reset, :hidden')
                .val('')
                .removeAttr('checked')
                .removeAttr('selected');

            $('.dropdown', self.refs.form).dropdown('restore defaults')

            self.errors = {}
            self.update()
        }

        self.check_form = function (event) {
            if (event) {
                event.preventDefault()
            }

            self.file_upload_progress_handler(undefined)

            self.errors = {}
            var validate_data = get_form_data(self.refs.form)

            var required_fields = ['name', 'type', 'data_file']
            required_fields.forEach(field => {
                if (validate_data[field] === '') {
                    self.errors[field] = "This field is required"
                }
            })

            if (Object.keys(self.errors).length > 0) {

                self.update()
                return
            }

            self.prepare_upload(self.upload)()
        }

        self.upload = function () {

            var metadata = get_form_data(self.refs.form)
            delete metadata.data_file

            if (metadata.is_public === 'on') {
                var public_confirm = confirm("You are creating a public dataset. Are you sure you wish to continue?")
                if (!public_confirm) {
                    return
                }
            }

            var data_file = self.refs.data_file.refs.file_input.files[0]

            CODALAB.api.create_dataset(metadata, data_file, self.file_upload_progress_handler)
                .done(function (data) {
                    toastr.success("Dataset successfully uploaded!")
                    self.update_datasets()
                    self.clear_form()
                    $(self.refs.dataset_creation_modal).modal('hide')
                    CODALAB.events.trigger('reload_quota_cleanup')
                })
                .fail(function (response) {
                    if (response) {
                        try {
                            var errors = JSON.parse(response.responseText)

                            Object.keys(errors).map(function (key, index) {
                                errors[key] = errors[key].join('; ')
                            })

                            self.update({errors: errors})
                        } catch (e) {

                        }
                    }
                    toastr.error("Creation failed, error occurred")
                })
                .always(function () {
                    self.hide_progress_bar()
                })
        }

        self.toggle_is_public = () => {
            let message = self.selected_row.is_public
                ? 'Are you sure you want to make this dataset private? It will no longer be available to other users.'
                : 'Are you sure you want to make this dataset public? It will become visible to everyone'
            if (confirm(message)) {
                CODALAB.api.update_dataset(self.selected_row.id, {id: self.selected_row.id, is_public: !self.selected_row.is_public})
                    .done(data => {
                        toastr.success('Dataset updated')
                        $(self.refs.info_modal).modal('hide')
                        self.filter()
                    })
                    .fail(resp => {
                        toastr.error(resp.responseJSON['is_public'])
                    })
            }
        }

        self.mark_dataset_for_deletion = function(dataset, e) {
            if (e.target.checked) {
                self.marked_datasets.push(dataset.id)
            }
            else {
                self.marked_datasets.splice(self.marked_datasets.indexOf(dataset.id), 1)
            }
        }

        CODALAB.events.on('reload_datasets', self.update_datasets)

});

riot.tag2('public-datasets', '<div class="page-header"> <h1 class="page-title">Public Datasets</h1> <a class="create-btn" href="{URLS.DATASET_CREATE}?from=public"> <i class="bi bi-plus-square-fill me-1"></i> Create </a> </div> <div class="content-container"> <div class="filters-panel"> <h3>Filters</h3> <div class="filter-group"> <label class="filter-label" for="search-title-description"><strong>Search by Title/Description</strong></label> <div class="ui input"> <input type="text" id="search-title-description" oninput="{on_title_description_input}" placeholder="Enter title/description..."> </div> </div> <div class="filter-group"> <strong class="filter-label">Order By</strong> <label><input type="radio" name="order" value="most_downloaded" onchange="{set_ordering}"> Most downloaded first</label> <label><input type="radio" name="order" value="recently_added" onchange="{set_ordering}"> Recently added first</label> </div> <div class="filter-group"> <strong class="filter-label">Dataset properties</strong> <label><input type="checkbox" onchange="{toggle_has_license}"> Has License</label> <label><input type="checkbox" onchange="{toggle_is_verified}"> Is Verified</label> </div> <div class="filter-group" show="{should_show_clear_filters()}"> <button class="clear-filters-btn ui button" onclick="{clear_all_filters}">Clear All Filters</button> </div> </div> <div class="list-panel"> <div id="loading" class="loading-indicator" show="{!datasets}"> <div class="spinner"></div> </div> <div each="{dataset in datasets.results}" class="tile-wrapper"> <div class="full-width"> <a class="link-no-deco" href="../{dataset.id}"> <div class="dataset-info"> <h4 class="heading">{dataset.name}</h4> <p class="dataset-description">{pretty_description(dataset.description)}</p> <div class="dataset-stats"> <div title="Created Date"><i class="bi bi-calendar-event-fill"></i> {pretty_date(dataset.created_when)}</div> <div title="File Size"><i class="bi bi-file-earmark-fill"></i> {pretty_bytes(dataset.file_size)}</div> <div title="License"><i class="bi bi-shield-shaded"></i> {dataset.license || \'N/A\'}</div> <div title="Downloads"><i class="bi bi-file-earmark-arrow-down-fill"></i> {dataset.downloads}</div> <div if="{dataset.is_verified}" title="Verified"><i class="bi bi-check-circle-fill green"></i>Verified</div> </div> <div class="dataset-stats"> <div class="uploader"> <em>Uploaded by: <strong>{dataset.created_by}</strong></em> </div> </div> </div> </a> </div> </div> <div class="no-results-message" if="{datasets.results && datasets.results.length === 0}"> <div class="ui warning message"> <div class="header">No datasets found</div> Try changing your filters or search term. </div> </div> <div class="pagination-nav" if="{datasets.next || datasets.previous}"> <button show="{datasets.previous}" onclick="{handle_ajax_pages.bind(this, -1)}" class="float-left ui inline button active">Back</button> <button hide="{datasets.previous}" disabled class="float-left ui inline button disabled">Back</button> {current_page} of {Math.ceil(datasets.count / datasets.page_size)} <button show="{datasets.next}" onclick="{handle_ajax_pages.bind(this, 1)}" class="float-right ui inline button active">Next</button> <button hide="{datasets.next}" disabled class="float-right ui inline button disabled">Next</button> </div> </div> </div>', 'public-datasets { width: 100%; } public-datasets,[data-is="public-datasets"]{ display: block; margin-bottom: 5px; } public-datasets .page-header,[data-is="public-datasets"] .page-header{ display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; } public-datasets .page-title,[data-is="public-datasets"] .page-title{ margin: 0; font-size: 24px; font-weight: bold; color: #1b1b1b; } public-datasets .create-btn,[data-is="public-datasets"] .create-btn{ font-size: 14px; padding: 0.5em 1em; background-color: #43637a; color: #fff; text-decoration: none; border-radius: 4px; display: inline-block; cursor: pointer; transition: background-color 0.2s ease; } public-datasets .create-btn:hover,[data-is="public-datasets"] .create-btn:hover{ background-color: #2d3f4d; color: #fff; text-decoration: none; } public-datasets .content-container,[data-is="public-datasets"] .content-container{ display: flex; width: 100%; } public-datasets .filters-panel,[data-is="public-datasets"] .filters-panel{ width: 250px; flex-shrink: 0; border: 1px solid #ddd; padding: 10px; margin-right: 10px; background: #f9f9f9; } public-datasets .filters-panel input[type="text"],[data-is="public-datasets"] .filters-panel input[type="text"]{ width: 100%; padding: 5px; margin: 5px 0 5px 0; border: 1px solid #ddd; border-radius: 4px; } public-datasets .filters-panel input[type="radio"],[data-is="public-datasets"] .filters-panel input[type="radio"],public-datasets .filters-panel input[type="checkbox"],[data-is="public-datasets"] .filters-panel input[type="checkbox"]{ margin-right: 5px; } public-datasets .filter-group,[data-is="public-datasets"] .filter-group{ margin-bottom: 20px; } public-datasets .filter-label,[data-is="public-datasets"] .filter-label{ font-size: 14px; font-weight: bold; display: block; margin-bottom: 8px; } public-datasets .filter-group label,[data-is="public-datasets"] .filter-group label{ display: block; font-size: 13px; margin-bottom: 6px; } public-datasets .list-panel,[data-is="public-datasets"] .list-panel{ flex-grow: 1; } public-datasets .pagination-nav,[data-is="public-datasets"] .pagination-nav{ padding: 10px 0; width: 100%; text-align: center; margin-bottom: 20px; } public-datasets .float-left,[data-is="public-datasets"] .float-left{ float: left; } public-datasets .float-right,[data-is="public-datasets"] .float-right{ float: right; } public-datasets .link-no-deco,[data-is="public-datasets"] .link-no-deco{ all: unset; text-decoration: none; cursor: pointer; width: 100%; } public-datasets .full-width,[data-is="public-datasets"] .full-width{ width: 100%; } public-datasets .tile-wrapper,[data-is="public-datasets"] .tile-wrapper{ display: flex; border: 1px solid #ddd; padding: 1em; margin-bottom: 1em; border-radius: 5px; background-color: #f9f9f9; transition: all 75ms ease-in-out; } public-datasets .tile-wrapper:hover,[data-is="public-datasets"] .tile-wrapper:hover{ box-shadow: 0 3px 4px -1px #cac9c9; background-color: #e6edf2; border: solid 1px #a5b7c5; } public-datasets .dataset-info,[data-is="public-datasets"] .dataset-info{ width: 100%; } public-datasets .dataset-info .heading,[data-is="public-datasets"] .dataset-info .heading{ font-size: 1.2em; margin-bottom: 0.3em; } public-datasets .dataset-description,[data-is="public-datasets"] .dataset-description{ margin-bottom: 0.5em; font-size: 13px; line-height: 1.15em; color: #555; } public-datasets .uploader,[data-is="public-datasets"] .uploader{ font-size: 0.9em; color: #777; } public-datasets .green,[data-is="public-datasets"] .green{ color: #009022; } public-datasets .dataset-stats,[data-is="public-datasets"] .dataset-stats{ display: flex; flex-wrap: wrap; gap: 1em; font-size: 0.9em; align-items: center; margin-top: 0.5em; color: #555; } public-datasets .dataset-stats > div,[data-is="public-datasets"] .dataset-stats > div{ display: flex; align-items: center; gap: 0.4em; } public-datasets .ui.mini.primary.button,[data-is="public-datasets"] .ui.mini.primary.button{ padding: 0.4em 0.8em; font-size: 0.85em; } public-datasets .loading-indicator,[data-is="public-datasets"] .loading-indicator{ display: flex; align-items: center; padding: 20px; width: 100%; margin: 0 auto; } public-datasets .spinner,[data-is="public-datasets"] .spinner{ border: 4px solid rgba(0,0,0,0.1); width: 36px; height: 36px; border-radius: 50%; border-top-color: #3498db; animation: spin 1s ease-in-out infinite; } @-moz-keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } } @-webkit-keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } } @-o-keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } } @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }', '', function(opts) {
    var self = this
    self.search_timer = null
    self.datasets = {}

    self.filter_state = {
        search: '',
        ordering: '',
        has_license: false,
        is_verified: false,
    }

    self.on_title_description_input = function(e) {
        const value = e.target.value
        self.filter_state.search = value
        self.update()
        if (self.search_timer) clearTimeout(self.search_timer)
        self.search_timer = setTimeout(() => {
            self.update_datasets_list(1)
        }, 1000)
    }

    self.set_ordering = function (e) {
        self.filter_state.ordering = e.target.value
        self.update()
        self.update_datasets_list(1)
    }

    self.toggle_has_license = function(e) {
        self.filter_state.has_license = e.target.checked
        self.update()
        self.update_datasets_list(1)
    }

    self.toggle_is_verified = function(e) {
        self.filter_state.is_verified = e.target.checked
        self.update()
        self.update_datasets_list(1)
    }

    self.should_show_clear_filters = function () {
        const f = self.filter_state
        return f.search || f.ordering || f.has_license || f.is_verified
    }

    self.clear_all_filters = function() {
        self.filter_state = {
            search: '',
            ordering: '',
            has_license: false,
            is_verified: false,
        }
        document.getElementById('search-title-description').value = ''
        document.querySelectorAll('input[name="order"]').forEach(r => r.checked = false)
        document.querySelectorAll('input[type="checkbox"]').forEach(c => c.checked = false)
        self.update_datasets_list(1)
    }

    self.one("mount", function () {
        self.update_datasets_list(self.get_url_page_number_or_default())
    })

    self.handle_ajax_pages = function (num) {
        $('.pagination-nav > button').prop('disabled', true)
        self.update_datasets_list(self.get_url_page_number_or_default() + num)
    }

    self.update_datasets_list = function (num) {
        self.current_page = num;
        $('#loading').show();
        $('.pagination-nav').hide();

        function handleSuccess(response) {
            self.datasets = response;
            $('#loading').hide();
            $('.pagination-nav').show();
            history.pushState("", document.title, "?page=" + self.current_page);
            $('.pagination-nav > button').prop('disabled', false);
            self.update();
        }

        return CODALAB.api.get_public_datasets({
              "page": self.current_page,
              "search": self.filter_state.search,
              "ordering": self.filter_state.ordering,
              "has_license": self.filter_state.has_license,
              "is_verified": self.filter_state.is_verified
            })
            .fail(function (resp) {
                $('#loading').hide()
                $('.pagination-nav').show()
                let message = "Could not load datasets list"
                try {
                    const json = JSON.parse(resp.responseText)
                    if (json.detail) message = json.detail
                } catch (_) {
                    if (resp.responseText) message = resp.responseText
                }
                toastr.error(message)
            })
            .done(handleSuccess);
    }

    self.pretty_date = function (date_string) {
        return !!date_string ? luxon.DateTime.fromISO(date_string).toLocaleString(luxon.DateTime.DATE_FULL) : ''
    }

    self.pretty_description = function (description) {
        return description.substring(0, 120) + (description.length > 120 ? '...' : '') || ''
    }

    self.get_url_page_number_or_default = function () {
        let urlParams = new URLSearchParams(window.location.search)
        if (urlParams.has('page')) {
            let p = parseInt(urlParams.get('page'))
            return p < 1 ? 1 : p
        }
        return 1
    }

    $(window).on('popstate', function () {
        self.update_datasets_list(self.get_url_page_number_or_default())
    })
});


riot.tag2('input-file', '<div class="ui left action file input" ref="submission_upload"> <button type="button" class="ui icon button" onclick="{open_file_selection}"> <i class="attach icon"></i> </button> <input type="file" name="{opts.name}" ref="file_input" accept="{opts.accept}"> <input ref="file_input_display" readonly onclick="{open_file_selection}"> </div>', 'input-file,[data-is="input-file"]{ display: block; }', 'class="field {error: opts.error}"', function(opts) {
        var self = this

        self.one("mount", function () {

            $(self.refs.file_input)
                .on('change', function (event) {

                    self.refs.file_input_display.value = self.refs.file_input.value.replace(/\\/g, '/').replace(/.*\//, '')
                    self.update()
                })
                .on('click', function() {

                    self.refs.file_input.value = null
                })
        })

        self.open_file_selection = function () {
            self.refs.file_input.click()

            self.refs.submission_upload.style['display'] = 'none'
            setTimeout(function () {
                self.refs.submission_upload.style['display'] = ''
            }, 6000);
        }
});



riot.tag2('input-text', '<div> <label>{opts.label}</label> <input type="text" name="{opts.name}" ref="input" placeholder="{opts.placeholder}"> </div>', 'input-text,[data-is="input-text"]{ display: block; }', 'class="field {error: opts.error}"', function(opts) {
});

riot.tag2('sorting-chevrons', '<span class="right floated"> <i class="chevron down icon" show="{opts.index + 1 < opts.data.length}" onclick="{move_down.bind(this, opts.index)}"></i> </span> <span class="right floated"> <i class="chevron up icon" show="{opts.index > 0}" onclick="{move_up.bind(this, opts.index)}"></i> </span>', '', '', function(opts) {
        var self = this

        self.move_up = function(index) {
            self.move(index, -1)
        }

        self.move_down = function(index) {
            self.move(index, 1)
        }
        self.move = function(index, offset){
            var data_to_move = self.opts.data[index]

            self.opts.data.splice(index, 1)

            self.opts.data.splice(index + offset, 0, data_to_move)

            self.parent.update()

            if(self.opts.onupdate) {
                self.opts.onupdate()
            }
        }
});

riot.tag2('loader', '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="60pt" height="60pt" viewbox="0 0 130 130" version="1.1"> <defs> <g> <symbol overflow="visible" id="glyph0-0"> <path style="stroke:none;" d="M 0.644531 0 L 0.644531 -14.34375 L 12.03125 -14.34375 L 12.03125 0 Z M 10.234375 -1.796875 L 10.234375 -12.546875 L 2.441406 -12.546875 L 2.441406 -1.796875 Z M 10.234375 -1.796875 "></path> </symbol> <symbol overflow="visible" id="glyph0-1"> <path style="stroke:none;" d="M 1.523438 -14.34375 L 3.46875 -14.34375 L 3.46875 -1.710938 L 10.734375 -1.710938 L 10.734375 0 L 1.523438 0 Z M 1.523438 -14.34375 "></path> </symbol> <symbol overflow="visible" id="glyph0-2"> <path style="stroke:none;" d="M 7.714844 -14.734375 C 10.246094 -14.734375 12.121094 -13.921875 13.339844 -12.296875 C 14.289062 -11.027344 14.765625 -9.402344 14.765625 -7.421875 C 14.765625 -5.28125 14.222656 -3.5 13.132812 -2.078125 C 11.859375 -0.414062 10.039062 0.421875 7.675781 0.421875 C 5.46875 0.421875 3.734375 -0.308594 2.46875 -1.765625 C 1.34375 -3.171875 0.78125 -4.953125 0.78125 -7.101562 C 0.78125 -9.039062 1.261719 -10.699219 2.226562 -12.078125 C 3.464844 -13.851562 5.292969 -14.734375 7.714844 -14.734375 Z M 7.910156 -1.320312 C 9.621094 -1.320312 10.859375 -1.933594 11.625 -3.160156 C 12.390625 -4.386719 12.773438 -5.796875 12.773438 -7.390625 C 12.773438 -9.078125 12.332031 -10.4375 11.449219 -11.464844 C 10.566406 -12.492188 9.363281 -13.007812 7.832031 -13.007812 C 6.347656 -13.007812 5.136719 -12.5 4.199219 -11.480469 C 3.261719 -10.460938 2.792969 -8.957031 2.792969 -6.972656 C 2.792969 -5.382812 3.195312 -4.042969 4 -2.953125 C 4.804688 -1.863281 6.105469 -1.320312 7.910156 -1.320312 Z M 7.910156 -1.320312 "></path> </symbol> <symbol overflow="visible" id="glyph0-3"> <path style="stroke:none;" d="M 8.886719 -5.878906 L 6.710938 -12.21875 L 4.394531 -5.878906 Z M 5.695312 -14.34375 L 7.890625 -14.34375 L 13.09375 0 L 10.96875 0 L 9.511719 -4.296875 L 3.835938 -4.296875 L 2.285156 0 L 0.292969 0 Z M 5.695312 -14.34375 "></path> </symbol> <symbol overflow="visible" id="glyph0-4"> <path style="stroke:none;" d="M 7.03125 -1.660156 C 7.6875 -1.660156 8.230469 -1.726562 8.652344 -1.867188 C 9.40625 -2.121094 10.027344 -2.609375 10.507812 -3.328125 C 10.890625 -3.910156 11.167969 -4.652344 11.335938 -5.554688 C 11.433594 -6.097656 11.484375 -6.597656 11.484375 -7.0625 C 11.484375 -8.839844 11.132812 -10.21875 10.425781 -11.203125 C 9.71875 -12.183594 8.582031 -12.675781 7.011719 -12.675781 L 3.5625 -12.675781 L 3.5625 -1.660156 Z M 1.609375 -14.34375 L 7.421875 -14.34375 C 9.394531 -14.34375 10.925781 -13.644531 12.011719 -12.246094 C 12.980469 -10.984375 13.46875 -9.367188 13.46875 -7.390625 C 13.46875 -5.867188 13.179688 -4.492188 12.609375 -3.261719 C 11.597656 -1.085938 9.863281 0 7.402344 0 L 1.609375 0 Z M 1.609375 -14.34375 "></path> </symbol> <symbol overflow="visible" id="glyph0-5"> <path style="stroke:none;" d="M 1.960938 -14.34375 L 3.925781 -14.34375 L 3.925781 0 L 1.960938 0 Z M 1.960938 -14.34375 "></path> </symbol> <symbol overflow="visible" id="glyph0-6"> <path style="stroke:none;" d="M 1.523438 -14.34375 L 3.820312 -14.34375 L 11.0625 -2.726562 L 11.0625 -14.34375 L 12.910156 -14.34375 L 12.910156 0 L 10.734375 0 L 3.378906 -11.609375 L 3.378906 0 L 1.523438 0 Z M 1.523438 -14.34375 "></path> </symbol> <symbol overflow="visible" id="glyph0-7"> <path style="stroke:none;" d="M 7.726562 -14.71875 C 9.074219 -14.71875 10.238281 -14.457031 11.21875 -13.9375 C 12.644531 -13.1875 13.519531 -11.875 13.835938 -10 L 11.914062 -10 C 11.679688 -11.046875 11.195312 -11.8125 10.460938 -12.289062 C 9.722656 -12.769531 8.796875 -13.007812 7.675781 -13.007812 C 6.347656 -13.007812 5.230469 -12.507812 4.320312 -11.515625 C 3.414062 -10.519531 2.960938 -9.03125 2.960938 -7.0625 C 2.960938 -5.355469 3.332031 -3.964844 4.082031 -2.894531 C 4.832031 -1.824219 6.050781 -1.289062 7.742188 -1.289062 C 9.039062 -1.289062 10.113281 -1.664062 10.960938 -2.417969 C 11.8125 -3.167969 12.246094 -4.382812 12.265625 -6.0625 L 7.773438 -6.0625 L 7.773438 -7.675781 L 14.070312 -7.675781 L 14.070312 0 L 12.820312 0 L 12.351562 -1.84375 C 11.695312 -1.121094 11.113281 -0.621094 10.605469 -0.34375 C 9.753906 0.140625 8.667969 0.382812 7.351562 0.382812 C 5.652344 0.382812 4.191406 -0.167969 2.96875 -1.269531 C 1.632812 -2.648438 0.96875 -4.542969 0.96875 -6.953125 C 0.96875 -9.355469 1.617188 -11.265625 2.921875 -12.6875 C 4.15625 -14.039062 5.757812 -14.71875 7.726562 -14.71875 Z M 7.726562 -14.71875 "></path> </symbol> </g> </defs> <g id="surface1" fill="#000000"> <path class="r1" d="M 71 35 C 71 38.3125 68.3125 41 65 41 C 61.6875 41 59 38.3125 59 35 C 59 31.6875 61.6875 29 65 29 C 68.3125 29 71 31.6875 71 35 "></path> <path class="r1" d="M 83.992188 42.5 C 83.992188 45.8125 81.304688 48.5 77.992188 48.5 C 74.675781 48.5 71.992188 45.8125 71.992188 42.5 C 71.992188 39.1875 74.675781 36.5 77.992188 36.5 C 81.304688 36.5 83.992188 39.1875 83.992188 42.5 "></path> <path class="r1" d="M 96.980469 50 C 96.980469 53.3125 94.292969 56 90.980469 56 C 87.667969 56 84.980469 53.3125 84.980469 50 C 84.980469 46.6875 87.667969 44 90.980469 44 C 94.292969 44 96.980469 46.6875 96.980469 50 "></path> <path class="r1" d="M 96.980469 65 C 96.980469 68.3125 94.292969 71 90.980469 71 C 87.667969 71 84.980469 68.3125 84.980469 65 C 84.980469 61.6875 87.667969 59 90.980469 59 C 94.292969 59 96.980469 61.6875 96.980469 65 "></path> <path class="r1" d="M 96.980469 80 C 96.980469 83.3125 94.292969 86 90.980469 86 C 87.667969 86 84.980469 83.3125 84.980469 80 C 84.980469 76.6875 87.667969 74 90.980469 74 C 94.292969 74 96.980469 76.6875 96.980469 80 "></path> <path class="r1" d="M 83.992188 87.5 C 83.992188 90.8125 81.304688 93.5 77.992188 93.5 C 74.675781 93.5 71.992188 90.8125 71.992188 87.5 C 71.992188 84.1875 74.675781 81.5 77.992188 81.5 C 81.304688 81.5 83.992188 84.1875 83.992188 87.5 "></path> <path class="r1" d="M 71 95 C 71 98.3125 68.3125 101 65 101 C 61.6875 101 59 98.3125 59 95 C 59 91.6875 61.6875 89 65 89 C 68.3125 89 71 91.6875 71 95 "></path> <path class="r1" d="M 58.007812 87.5 C 58.007812 90.8125 55.324219 93.5 52.007812 93.5 C 48.695312 93.5 46.007812 90.8125 46.007812 87.5 C 46.007812 84.1875 48.695312 81.5 52.007812 81.5 C 55.324219 81.5 58.007812 84.1875 58.007812 87.5 "></path> <path class="r1" d="M 45.019531 80 C 45.019531 83.3125 42.332031 86 39.019531 86 C 35.707031 86 33.019531 83.3125 33.019531 80 C 33.019531 76.6875 35.707031 74 39.019531 74 C 42.332031 74 45.019531 76.6875 45.019531 80 "></path> <path class="r1" d="M 45.019531 65 C 45.019531 68.3125 42.332031 71 39.019531 71 C 35.707031 71 33.019531 68.3125 33.019531 65 C 33.019531 61.6875 35.707031 59 39.019531 59 C 42.332031 59 45.019531 61.6875 45.019531 65 "></path> <path class="r1" d="M 45.019531 50 C 45.019531 53.3125 42.332031 56 39.019531 56 C 35.707031 56 33.019531 53.3125 33.019531 50 C 33.019531 46.6875 35.707031 44 39.019531 44 C 42.332031 44 45.019531 46.6875 45.019531 50 "></path> <path class="r1" d="M 58.007812 42.5 C 58.007812 45.8125 55.324219 48.5 52.007812 48.5 C 48.695312 48.5 46.007812 45.8125 46.007812 42.5 C 46.007812 39.1875 48.695312 36.5 52.007812 36.5 C 55.324219 36.5 58.007812 39.1875 58.007812 42.5 "></path> <path class="r2" d="M 70 20 C 70 26.667969 60 26.667969 60 20 C 60 13.332031 70 13.332031 70 20 "></path> <path class="r2" d="M 82.992188 27.5 C 82.992188 34.167969 72.992188 34.167969 72.992188 27.5 C 72.992188 20.832031 82.992188 20.832031 82.992188 27.5 "></path> <path class="r2" d="M 95.980469 35 C 95.980469 41.667969 85.980469 41.667969 85.980469 35 C 85.980469 28.332031 95.980469 28.332031 95.980469 35 "></path> <path class="r2" d="M 108.972656 42.5 C 108.972656 49.167969 98.972656 49.167969 98.972656 42.5 C 98.972656 35.832031 108.972656 35.832031 108.972656 42.5 "></path> <path class="r2" d="M 108.972656 57.5 C 108.972656 64.167969 98.972656 64.167969 98.972656 57.5 C 98.972656 50.832031 108.972656 50.832031 108.972656 57.5 "></path> <path class="r2" d="M 108.972656 72.5 C 108.972656 79.167969 98.972656 79.167969 98.972656 72.5 C 98.972656 65.832031 108.972656 65.832031 108.972656 72.5 "></path> <path class="r2" d="M 108.972656 87.5 C 108.972656 94.167969 98.972656 94.167969 98.972656 87.5 C 98.972656 80.832031 108.972656 80.832031 108.972656 87.5 "></path> <path class="r2" d="M 95.980469 95 C 95.980469 101.667969 85.980469 101.667969 85.980469 95 C 85.980469 88.332031 95.980469 88.332031 95.980469 95 "></path> <path class="r2" d="M 82.992188 102.5 C 82.992188 109.167969 72.992188 109.167969 72.992188 102.5 C 72.992188 95.832031 82.992188 95.832031 82.992188 102.5 "></path> <path class="r2" d="M 70 110 C 70 116.667969 60 116.667969 60 110 C 60 103.332031 70 103.332031 70 110 "></path> <path class="r2" d="M 57.007812 102.5 C 57.007812 109.167969 47.007812 109.167969 47.007812 102.5 C 47.007812 95.832031 57.007812 95.832031 57.007812 102.5 "></path> <path class="r2" d="M 44.019531 95 C 44.019531 101.667969 34.019531 101.667969 34.019531 95 C 34.019531 88.332031 44.019531 88.332031 44.019531 95 "></path> <path class="r2" d="M 31.027344 87.5 C 31.027344 94.167969 21.027344 94.167969 21.027344 87.5 C 21.027344 80.832031 31.027344 80.832031 31.027344 87.5 "></path> <path class="r2" d="M 31.027344 72.5 C 31.027344 79.167969 21.027344 79.167969 21.027344 72.5 C 21.027344 65.832031 31.027344 65.832031 31.027344 72.5 "></path> <path class="r2" d="M 31.027344 57.5 C 31.027344 64.167969 21.027344 64.167969 21.027344 57.5 C 21.027344 50.832031 31.027344 50.832031 31.027344 57.5 "></path> <path class="r2" d="M 31.027344 42.5 C 31.027344 49.167969 21.027344 49.167969 21.027344 42.5 C 21.027344 35.832031 31.027344 35.832031 31.027344 42.5 "></path> <path class="r2" d="M 44.019531 35 C 44.019531 41.667969 34.019531 41.667969 34.019531 35 C 34.019531 28.332031 44.019531 28.332031 44.019531 35 "></path> <path class="r2" d="M 57.007812 27.5 C 57.007812 34.167969 47.007812 34.167969 47.007812 27.5 C 47.007812 20.832031 57.007812 20.832031 57.007812 27.5 "></path> <path class="r3" d="M 67.875 10 C 67.875 13.832031 62.125 13.832031 62.125 10 C 62.125 6.167969 67.875 6.167969 67.875 10 "></path> <path class="r3" d="M 79.78125 16.875 C 79.78125 20.707031 74.03125 20.707031 74.03125 16.875 C 74.03125 13.042969 79.78125 13.042969 79.78125 16.875 "></path> <path class="r3" d="M 91.691406 23.75 C 91.691406 27.582031 85.941406 27.582031 85.941406 23.75 C 85.941406 19.917969 91.691406 19.917969 91.691406 23.75 "></path> <path class="r3" d="M 103.597656 30.625 C 103.597656 34.457031 97.847656 34.457031 97.847656 30.625 C 97.847656 26.792969 103.597656 26.792969 103.597656 30.625 "></path> <path class="r3" d="M 115.507812 37.5 C 115.507812 41.332031 109.757812 41.332031 109.757812 37.5 C 109.757812 33.667969 115.507812 33.667969 115.507812 37.5 "></path> <path class="r3" d="M 115.507812 51.25 C 115.507812 55.082031 109.757812 55.082031 109.757812 51.25 C 109.757812 47.417969 115.507812 47.417969 115.507812 51.25 "></path> <path class="r3" d="M 115.507812 65 C 115.507812 68.832031 109.757812 68.832031 109.757812 65 C 109.757812 61.167969 115.507812 61.167969 115.507812 65 "></path> <path class="r3" d="M 115.507812 78.75 C 115.507812 82.582031 109.757812 82.582031 109.757812 78.75 C 109.757812 74.917969 115.507812 74.917969 115.507812 78.75 "></path> <path class="r3" d="M 115.507812 92.5 C 115.507812 96.332031 109.757812 96.332031 109.757812 92.5 C 109.757812 88.667969 115.507812 88.667969 115.507812 92.5 "></path> <path class="r3" d="M 103.597656 99.375 C 103.597656 103.207031 97.847656 103.207031 97.847656 99.375 C 97.847656 95.542969 103.597656 95.542969 103.597656 99.375 "></path> <path class="r3" d="M 91.691406 106.25 C 91.691406 110.082031 85.941406 110.082031 85.941406 106.25 C 85.941406 102.417969 91.691406 102.417969 91.691406 106.25 "></path> <path class="r3" d="M 79.78125 113.125 C 79.78125 116.957031 74.03125 116.957031 74.03125 113.125 C 74.03125 109.292969 79.78125 109.292969 79.78125 113.125 "></path> <path class="r3" d="M 67.875 120 C 67.875 123.832031 62.125 123.832031 62.125 120 C 62.125 116.167969 67.875 116.167969 67.875 120 "></path> <path class="r3" d="M 55.96875 113.125 C 55.96875 116.957031 50.21875 116.957031 50.21875 113.125 C 50.21875 109.292969 55.96875 109.292969 55.96875 113.125 "></path> <path class="r3" d="M 44.058594 106.25 C 44.058594 110.082031 38.308594 110.082031 38.308594 106.25 C 38.308594 102.417969 44.058594 102.417969 44.058594 106.25 "></path> <path class="r3" d="M 32.152344 99.375 C 32.152344 103.207031 26.402344 103.207031 26.402344 99.375 C 26.402344 95.542969 32.152344 95.542969 32.152344 99.375 "></path> <path class="r3" d="M 20.242188 92.5 C 20.242188 96.332031 14.492188 96.332031 14.492188 92.5 C 14.492188 88.667969 20.242188 88.667969 20.242188 92.5 "></path> <path class="r3" d="M 20.242188 78.75 C 20.242188 82.582031 14.492188 82.582031 14.492188 78.75 C 14.492188 74.917969 20.242188 74.917969 20.242188 78.75 "></path> <path class="r3" d="M 20.242188 65 C 20.242188 68.832031 14.492188 68.832031 14.492188 65 C 14.492188 61.167969 20.242188 61.167969 20.242188 65 "></path> <path class="r3" d="M 20.242188 51.25 C 20.242188 55.082031 14.492188 55.082031 14.492188 51.25 C 14.492188 47.417969 20.242188 47.417969 20.242188 51.25 "></path> <path class="r3" d="M 20.242188 37.5 C 20.242188 41.332031 14.492188 41.332031 14.492188 37.5 C 14.492188 33.667969 20.242188 33.667969 20.242188 37.5 "></path> <path class="r3" d="M 32.152344 30.625 C 32.152344 34.457031 26.402344 34.457031 26.402344 30.625 C 26.402344 26.792969 32.152344 26.792969 32.152344 30.625 "></path> <path class="r3" d="M 44.058594 23.75 C 44.058594 27.582031 38.308594 27.582031 38.308594 23.75 C 38.308594 19.917969 44.058594 19.917969 44.058594 23.75 "></path> <path class="r3" d="M 55.96875 16.875 C 55.96875 20.707031 50.21875 20.707031 50.21875 16.875 C 50.21875 13.042969 55.96875 13.042969 55.96875 16.875 "></path> <path class="r4" d="M 66.800781 2 C 66.800781 4.398438 63.199219 4.398438 63.199219 2 C 63.199219 -0.398438 66.800781 -0.398438 66.800781 2 "></path> <path class="r4" d="M 77.710938 8.300781 C 77.710938 10.699219 74.113281 10.699219 74.113281 8.300781 C 74.113281 5.898438 77.710938 5.898438 77.710938 8.300781 "></path> <path class="r4" d="M 88.625 14.601562 C 88.625 17 85.023438 17 85.023438 14.601562 C 85.023438 12.199219 88.625 12.199219 88.625 14.601562 "></path> <path class="r4" d="M 99.535156 20.898438 C 99.535156 23.300781 95.9375 23.300781 95.9375 20.898438 C 95.9375 18.5 99.535156 18.5 99.535156 20.898438 "></path> <path class="r4" d="M 110.449219 27.199219 C 110.449219 29.601562 106.847656 29.601562 106.847656 27.199219 C 106.847656 24.800781 110.449219 24.800781 110.449219 27.199219 "></path> <path class="r4" d="M 121.359375 33.5 C 121.359375 35.898438 117.757812 35.898438 117.757812 33.5 C 117.757812 31.101562 121.359375 31.101562 121.359375 33.5 "></path> <path class="r4" d="M 121.359375 46.101562 C 121.359375 48.5 117.757812 48.5 117.757812 46.101562 C 117.757812 43.699219 121.359375 43.699219 121.359375 46.101562 "></path> <path class="r4" d="M 121.359375 58.699219 C 121.359375 61.101562 117.757812 61.101562 117.757812 58.699219 C 117.757812 56.300781 121.359375 56.300781 121.359375 58.699219 "></path> <path class="r4" d="M 121.359375 71.300781 C 121.359375 73.699219 117.757812 73.699219 117.757812 71.300781 C 117.757812 68.898438 121.359375 68.898438 121.359375 71.300781 "></path> <path class="r4" d="M 121.359375 83.898438 C 121.359375 86.300781 117.757812 86.300781 117.757812 83.898438 C 117.757812 81.5 121.359375 81.5 121.359375 83.898438 "></path> <path class="r4" d="M 121.359375 96.5 C 121.359375 98.898438 117.757812 98.898438 117.757812 96.5 C 117.757812 94.101562 121.359375 94.101562 121.359375 96.5 "></path> <path class="r4" d="M 110.449219 102.800781 C 110.449219 105.199219 106.847656 105.199219 106.847656 102.800781 C 106.847656 100.398438 110.449219 100.398438 110.449219 102.800781 "></path> <path class="r4" d="M 99.535156 109.101562 C 99.535156 111.5 95.9375 111.5 95.9375 109.101562 C 95.9375 106.699219 99.535156 106.699219 99.535156 109.101562 "></path> <path class="r4" d="M 88.625 115.398438 C 88.625 117.800781 85.023438 117.800781 85.023438 115.398438 C 85.023438 113 88.625 113 88.625 115.398438 "></path> <path class="r4" d="M 77.710938 121.699219 C 77.710938 124.101562 74.113281 124.101562 74.113281 121.699219 C 74.113281 119.300781 77.710938 119.300781 77.710938 121.699219 "></path> <path class="r4" d="M 66.800781 128 C 66.800781 130.398438 63.199219 130.398438 63.199219 128 C 63.199219 125.601562 66.800781 125.601562 66.800781 128 "></path> <path class="r4" d="M 55.886719 121.699219 C 55.886719 124.101562 52.289062 124.101562 52.289062 121.699219 C 52.289062 119.300781 55.886719 119.300781 55.886719 121.699219 "></path> <path class="r4" d="M 44.976562 115.398438 C 44.976562 117.800781 41.375 117.800781 41.375 115.398438 C 41.375 113 44.976562 113 44.976562 115.398438 "></path> <path class="r4" d="M 34.0625 109.101562 C 34.0625 111.5 30.464844 111.5 30.464844 109.101562 C 30.464844 106.699219 34.0625 106.699219 34.0625 109.101562 "></path> <path class="r4" d="M 23.152344 102.800781 C 23.152344 105.199219 19.550781 105.199219 19.550781 102.800781 C 19.550781 100.398438 23.152344 100.398438 23.152344 102.800781 "></path> <path class="r4" d="M 12.242188 96.5 C 12.242188 98.898438 8.640625 98.898438 8.640625 96.5 C 8.640625 94.101562 12.242188 94.101562 12.242188 96.5 "></path> <path class="r4" d="M 12.242188 83.898438 C 12.242188 86.300781 8.640625 86.300781 8.640625 83.898438 C 8.640625 81.5 12.242188 81.5 12.242188 83.898438 "></path> <path class="r4" d="M 12.242188 71.300781 C 12.242188 73.699219 8.640625 73.699219 8.640625 71.300781 C 8.640625 68.898438 12.242188 68.898438 12.242188 71.300781 "></path> <path class="r4" d="M 12.242188 58.699219 C 12.242188 61.101562 8.640625 61.101562 8.640625 58.699219 C 8.640625 56.300781 12.242188 56.300781 12.242188 58.699219 "></path> <path class="r4" d="M 12.242188 46.101562 C 12.242188 48.5 8.640625 48.5 8.640625 46.101562 C 8.640625 43.699219 12.242188 43.699219 12.242188 46.101562 "></path> <path class="r4" d="M 12.242188 33.5 C 12.242188 35.898438 8.640625 35.898438 8.640625 33.5 C 8.640625 31.101562 12.242188 31.101562 12.242188 33.5 "></path> <path class="r4" d="M 23.152344 27.199219 C 23.152344 29.601562 19.550781 29.601562 19.550781 27.199219 C 19.550781 24.800781 23.152344 24.800781 23.152344 27.199219 "></path> <path class="r4" d="M 34.0625 20.898438 C 34.0625 23.300781 30.464844 23.300781 30.464844 20.898438 C 30.464844 18.5 34.0625 18.5 34.0625 20.898438 "></path> <path class="r4" d="M 44.976562 14.601562 C 44.976562 17 41.375 17 41.375 14.601562 C 41.375 12.199219 44.976562 12.199219 44.976562 14.601562 "></path> <path class="r4" d="M 55.886719 8.300781 C 55.886719 10.699219 52.289062 10.699219 52.289062 8.300781 C 52.289062 5.898438 55.886719 5.898438 55.886719 8.300781 "></path> <g fill="#000000" id="text"> <use xlink:href="#glyph0-1" x="21.492188" y="72.578125"></use> <use xlink:href="#glyph0-2" x="32.615234" y="72.578125"></use> <use xlink:href="#glyph0-3" x="48.171875" y="72.578125"></use> <use xlink:href="#glyph0-4" x="61.511719" y="72.578125"></use> <use xlink:href="#glyph0-5" x="75.955078" y="72.578125"></use> <use xlink:href="#glyph0-6" x="81.511719" y="72.578125"></use> <use xlink:href="#glyph0-7" x="95.955078" y="72.578125"></use> </g> </g> </svg>', 'loader svg,[data-is="loader"] svg{ position: absolute; left: 50%; transform: translate(-50%, 0); }', '', function(opts) {
        let self = this
        self.TAU = Math.PI * 2
        self.time = 0

        self.on('mount', () => {
            gsap.ticker.add(self.draw)
        })
        self.scale = (old_value, old_min, old_max, new_min, new_max) => {
            return (((old_value - old_min) * (new_max - new_min)) / (old_max - old_min)) + new_min
        }
        self.get_alpha = i => {
            let offset = self.TAU / 7
            let alpha = Math.sin(self.time - (offset * i))
            alpha = self.scale(alpha, -1, 1, -3, -.6)
            return Math.exp(alpha)
        }

        self.draw = () => {
            gsap.to('.r1', {duration: 0, opacity: self.get_alpha(0)})
            gsap.to('.r2', {duration: 0, opacity: self.get_alpha(1)})
            gsap.to('.r3', {duration: 0, opacity: self.get_alpha(2)})
            gsap.to('.r4', {duration: 0, opacity: self.get_alpha(3)})
            self.time += .1
        }

});
riot.tag2('management', '<div class="ui top attached tabular menu"> <div class="active item" data-tab="submissions">Submissions</div> <div class="item" data-tab="datasets">Datasets and programs</div> <div class="item" data-tab="tasks">Tasks</div> <div class="item" data-tab="bundles">Competition Bundles</div> <div class="right menu"> <div class="item"> <help_button href="https://docs.codabench.org/latest/Organizers/Running_a_benchmark/Resource-Management/" tooltip_position="left center"> </help_button> </div> </div> </div> <div class="ui active bottom attached tab segment" data-tab="submissions"> <submission-management></submission-management> </div> <div class="ui bottom attached tab segment" data-tab="datasets"> <data-management></data-management> </div> <div class="ui bottom attached tab segment" data-tab="tasks"> <task-management></task-management> </div> <div class="ui bottom attached tab segment" data-tab="bundles"> <bundle-management></bundle-management> </div>', '', '', function(opts) {
        let self = this

        self.on('mount', () => {
            $('.ui.menu .item', self.root).tab()
        })
});

riot.tag2('bronze-medal', '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewbox="0 0 72 72" style="enable-background:new 0 0 72 72;" xml:space="preserve"> <polygon class="st0" points="57.1,0 25.9,0 20.3,7.9 51.3,7.9 "></polygon> <path class="st1" d="M51.3,37.9H20.7c-1.3,0-2.4-1.1-2.4-2.4V8.2c0-1.3,1.1-2.4,2.4-2.4h30.5c1.3,0,2.4,1.1,2.4,2.4v27.3 C53.6,36.9,52.6,37.9,51.3,37.9z"></path> <circle class="st2" cx="36" cy="41" r="30"></circle> <circle class="st3" cx="36" cy="41" r="22"></circle> <text transform="matrix(1 0 0 1 25 56.5253)" class="st2 st4 st5">3</text> <path class="st6" d="M14.7,0H46l5.6,7.9H21.7c-0.7,0-1.4-0.3-1.8-0.9L14.7,0z"></path> </svg>', 'bronze-medal .st0,[data-is="bronze-medal"] .st0{fill:#3D3B38;} bronze-medal .st1,[data-is="bronze-medal"] .st1{fill:none;stroke:#91612C;stroke-width:4;stroke-miterlimit:10;} bronze-medal .st2,[data-is="bronze-medal"] .st2{fill: #af7535;} bronze-medal .st3,[data-is="bronze-medal"] .st3{fill: #5b3800;} bronze-medal .st4,[data-is="bronze-medal"] .st4{font-family:\'GothamRounded-Book\';} bronze-medal .st5,[data-is="bronze-medal"] .st5{font-size:45.9409px;} bronze-medal .st6,[data-is="bronze-medal"] .st6{fill:#56524B;}', '', function(opts) {
});

riot.tag2('fifth-place-medal', '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewbox="0 0 72 72" style="enable-background:new 0 0 72 72;" xml:space="preserve"> <polygon class="st0" points="57.1,0 25.9,0 20.3,7.9 51.3,7.9 "></polygon> <path class="st1" d="M51.3,37.9H20.7c-1.3,0-2.4-1.1-2.4-2.4V8.2c0-1.3,1.1-2.4,2.4-2.4h30.5c1.3,0,2.4,1.1,2.4,2.4v27.3 C53.6,36.9,52.6,37.9,51.3,37.9z"></path> <circle class="st2" cx="36" cy="41" r="30"></circle> <circle class="st3" cx="36" cy="41" r="22"></circle> <text transform="matrix(1 0 0 1 25 57.3543)" class="st2 st4 st5">5</text> <path class="st6" d="M14.7,0H46l5.6,7.9H21.7c-0.7,0-1.4-0.3-1.8-0.9L14.7,0z"></path> </svg>', 'fifth-place-medal .st0,[data-is="fifth-place-medal"] .st0{fill:#3D3B38;} fifth-place-medal .st1,[data-is="fifth-place-medal"] .st1{fill:none;stroke:#68625C;stroke-width:4;stroke-miterlimit:10;} fifth-place-medal .st2,[data-is="fifth-place-medal"] .st2{fill: #c8bcb1;} fifth-place-medal .st3,[data-is="fifth-place-medal"] .st3{fill:#35322C;} fifth-place-medal .st4,[data-is="fifth-place-medal"] .st4{font-family:\'GothamRounded-Book\';} fifth-place-medal .st5,[data-is="fifth-place-medal"] .st5{font-size:45.9409px;} fifth-place-medal .st6,[data-is="fifth-place-medal"] .st6{fill:#56524B;}', '', function(opts) {
});

riot.tag2('fourth-place-medal', '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewbox="0 0 72 72" style="enable-background:new 0 0 72 72;" xml:space="preserve"> <polygon class="st0" points="57.1,0 25.9,0 20.3,7.9 51.3,7.9 "></polygon> <path class="st1" d="M51.3,37.9H20.7c-1.3,0-2.4-1.1-2.4-2.4V8.2c0-1.3,1.1-2.4,2.4-2.4h30.5c1.3,0,2.4,1.1,2.4,2.4v27.3 C53.6,36.9,52.6,37.9,51.3,37.9z"></path> <circle class="st2" cx="36" cy="41" r="30"></circle> <circle class="st3" cx="36" cy="41" r="22"></circle> <text transform="matrix(1 0 0 1 23 56.5253)" class="st2 st4 st5">4</text> <path class="st6" d="M14.7,0H46l5.6,7.9H21.7c-0.7,0-1.4-0.3-1.8-0.9L14.7,0z"></path> </svg>', 'fourth-place-medal .st0,[data-is="fourth-place-medal"] .st0{fill:#3D3B38;} fourth-place-medal .st1,[data-is="fourth-place-medal"] .st1{fill:none;stroke:#847661;stroke-width:4;stroke-miterlimit:10;} fourth-place-medal .st2,[data-is="fourth-place-medal"] .st2{fill: #c2ad8f;} fourth-place-medal .st3,[data-is="fourth-place-medal"] .st3{fill:#353126;} fourth-place-medal .st4,[data-is="fourth-place-medal"] .st4{font-family:\'GothamRounded-Book\';} fourth-place-medal .st5,[data-is="fourth-place-medal"] .st5{font-size:45.9409px;} fourth-place-medal .st6,[data-is="fourth-place-medal"] .st6{fill:#56524B;}', '', function(opts) {
});

riot.tag2('gold-medal', '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewbox="0 0 72 72" style="enable-background:new 0 0 72 72;" xml:space="preserve"> <polygon class="st0" points="57.1,0 25.9,0 20.3,7.9 51.3,7.9 "></polygon> <path class="st1" d="M51.3,37.9H20.7c-1.3,0-2.4-1.1-2.4-2.4V8.2c0-1.3,1.1-2.4,2.4-2.4h30.5c1.3,0,2.4,1.1,2.4,2.4v27.3 C53.6,36.9,52.6,37.9,51.3,37.9z"></path> <circle class="st2" cx="36" cy="41" r="30"></circle> <circle class="st3" cx="36" cy="41" r="22"></circle> <text transform="matrix(1 0 0 1 25 56)" class="st2 st4 st5">1</text> <path class="st6" d="M14.7,0H46l5.6,7.9H21.7c-0.7,0-1.4-0.3-1.8-0.9L14.7,0z"></path> </svg>', 'gold-medal .st0,[data-is="gold-medal"] .st0{fill:#3D3B38;} gold-medal .st1,[data-is="gold-medal"] .st1{fill:none;stroke:#F9AC31;stroke-width:4;stroke-miterlimit:10;} gold-medal .st2,[data-is="gold-medal"] .st2{fill:#F9AC31;} gold-medal .st3,[data-is="gold-medal"] .st3{fill: #cc8218;} gold-medal .st4,[data-is="gold-medal"] .st4{font-family:\'GothamRounded-Book\';} gold-medal .st5,[data-is="gold-medal"] .st5{font-size:45.9409px;} gold-medal .st6,[data-is="gold-medal"] .st6{fill:#56524B;}', '', function(opts) {
});

riot.tag2('silver-medal', '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewbox="0 0 72 72" style="enable-background:new 0 0 72 72;" xml:space="preserve"> <polygon class="st0" points="57.1,0 25.9,0 20.3,7.9 51.3,7.9 "></polygon> <path class="st1" d="M51.3,37.9H20.7c-1.3,0-2.4-1.1-2.4-2.4V8.2c0-1.3,1.1-2.4,2.4-2.4h30.5c1.3,0,2.4,1.1,2.4,2.4v27.3 C53.6,36.9,52.6,37.9,51.3,37.9z"></path> <circle class="st2" cx="36" cy="41" r="30"></circle> <circle class="st3" cx="36" cy="41" r="22"></circle> <text transform="matrix(1 0 0 1 25 56.5253)" class="st2 st4 st5">2</text> <path class="st6" d="M14.7,0H46l5.6,7.9H21.7c-0.7,0-1.4-0.3-1.8-0.9L14.7,0z"></path> </svg>', 'silver-medal .st0,[data-is="silver-medal"] .st0{fill:#3D3B38;} silver-medal .st1,[data-is="silver-medal"] .st1{fill:none;stroke:#C1BAB0;stroke-width:4;stroke-miterlimit:10;} silver-medal .st2,[data-is="silver-medal"] .st2{fill:#C1BAB0;} silver-medal .st3,[data-is="silver-medal"] .st3{fill: #7f7d7a;} silver-medal .st4,[data-is="silver-medal"] .st4{font-family:\'GothamRounded-Book\';} silver-medal .st5,[data-is="silver-medal"] .st5{font-size:45.9409px;} silver-medal .st6,[data-is="silver-medal"] .st6{fill:#56524B;}', '', function(opts) {
});

riot.tag2('organization-create', '<div class="ui raised segment"> <h1 class="ui dividing header">Create an Organization:</h1> <form class="ui form" id="organization-form"> <div class="field"> <label>Profile Photo</label> <div class="ui left action file input"> <button class="ui icon button" type="button" onclick="document.getElementById(\'profile_phtoto\').click()"> <i class="attach icon"></i> </button> <input id="profile_phtoto" type="file" ref="photo" accept="image/*"> <input riot-value="{logo_file_name}" readonly onclick="document.getElementById(\'profile_phtoto\').click()"> </div> </div> <div class="two fields"> <div class="field" id="name"> <label>Organization Name</label> <input type="text" name="name" placeholder="Name"> </div> <div class="field" id="email"> <label>Organization Email</label> <input type="text" name="email" placeholder="email@organization.com"> </div> </div> <div class="field" id="location"> <label>Location</label> <input type="text" name="location" placeholder="Location"> </div> <div class="field" id="description"> <label>Description</label> <textarea name="description"></textarea> </div> <div class="two fields"> <div class="field" id="website_url"> <label>Organization URL</label> <input type="text" name="website_url" placeholder="https://organization.com"> </div> <div class="field" id="linkedin_url"> <label>LinkedIn URL</label> <input type="text" name="linkedin_url" placeholder="https://www.linkedin.com/company/organization"> </div> </div> <div class="two fields"> <div class="field" id="twitter_url"> <label>Twitter URL</label> <input type="text" name="twitter_url" placeholder="https://twitter.com/organization"> </div> <div class="field" id="github_url"> <label>Github URL</label> <input type="text" name="github_url" placeholder="https://github.com/organization"> </div> </div> <div class="ui error message"></div> <button type="button" class="ui primary button" onclick="{save.bind(this)}" ref="submit_button">Submit</button> </form> </div>', '', '', function(opts) {
        self = this
        self.org_photo = null

        self.one("mount", function () {
            $.fn.form.settings.rules.test_http = function(param) {
                return /^(http|https):\/\/(.*)/.test(param)
            }

            $('#organization-form').form({
                keyboardShortcuts: false,
                fields: {
                    name: {
                        identifier: 'name',
                        optional: false,
                        rules: [{
                            type: 'empty'
                        }]
                    },
                    email: {
                        identifier: 'email',
                        optional: false,
                        rules: [{
                            type: 'email',
                            prompt: 'Please enter a valid {name}'
                        }]
                    },
                    website_url: {
                        identifier: 'website_url',
                        optional: true,
                        rules: [
                            {
                                type: 'url',
                                prompt: 'Please enter a valid {name}. Example: https://organization.com'
                            },
                            {
                                type: 'test_http',
                                prompt: '{name} must start with "http://" or "https://"'
                            }
                        ]
                    },
                    twitter_url: {
                        identifier: 'twitter_url',
                        optional: true,
                        rules: [
                            {
                                type: 'url',
                                prompt: 'Please enter a valid {name}. Example: https://organization.com'
                            },
                            {
                                type: 'test_http',
                                prompt: '{name} must start with "http://" or "https://"'
                            }
                        ]
                    },
                    linkedin_url: {
                        identifier: 'linkedin_url',
                        optional: true,
                        rules: [
                            {
                                type: 'url',
                                prompt: 'Please enter a valid {name}. Example: https://www.linkedin.com/company/organization'
                            },
                            {
                                type: 'test_http',
                                prompt: '{name} must start with "http://" or "https://"'
                            }
                        ]
                    },
                    github_url: {
                        identifier: 'github_url',
                        optional: true,
                        rules: [
                            {
                                type: 'url',
                                prompt: 'Please enter a valid {name}. Example: https://github.com/organization'
                            },
                            {
                                type: 'test_http',
                                prompt: '{name} must start with "http://" or "https://"'
                            }
                        ]
                    },
                },
                onSuccess: function () {
                    data = $('#organization-form').form('get values')
                    data.photo = self.org_photo
                    CODALAB.api.create_organization(data)
                        .done(data => {
                            toastr.success("Organization Created")
                            window.location.href = data.url
                        })
                        .fail(data => {
                            let errorsJSON = data.responseJSON
                            let errors = []
                            for(let key in errorsJSON){
                                errors.push(self.camel_case_to_regular(key) + ' - ' + errorsJSON[key])
                                $('#'+key).addClass('error')
                            }
                            $('#organization-form').form('add errors', errors)
                            self.refs.submit_button.disabled = false
                        })
                    return false
                },
                onFailure: function () {
                    self.refs.submit_button.disabled = false
                }
            })

            $(self.refs.photo).change(function () {
                self.logo_file_name = self.refs.photo.value.replace(/\\/g, '/').replace(/.*\//, '')
                self.update()
                getBase64(this.files[0]).then(function (data) {
                    self.org_photo = JSON.stringify({file_name: self.logo_file_name, data: data})
                })
            })
        })

        self.camel_case_to_regular = (str) => {
            str = str.replaceAll('_', ' ')
            return str.replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase())
        }

        self.save = () => {
            self.refs.submit_button.disabled = true
            $('#organization-form').form('validate form')
        }
});

riot.tag2('organization-edit', '<div class="ui raised segment"> <h1 class="ui dividing header">Organization Edit:</h1> <form class="ui form" id="organization-form"> <div class="field"> <label>Profile Photo</label> <label show="{original_org_photo}"> Uploaded Photo: <a href="{original_org_photo}" target="_blank">{original_org_photo_name}</a> </label> <div class="ui left action file input"> <button class="ui icon button" type="button" onclick="document.getElementById(\'profile_phtoto\').click()"> <i class="attach icon"></i> </button> <input id="profile_phtoto" type="file" ref="photo" accept="image/*"> <input riot-value="{logo_file_name}" readonly onclick="document.getElementById(\'profile_phtoto\').click()"> </div> </div> <div class="two fields"> <div class="required field" id="name"> <label>Organization Name</label> <input type="text" name="name" placeholder="Name"> </div> <div class="required field" id="email"> <label>Organization Email</label> <input type="text" name="email" placeholder="email@organization.com"> </div> </div> <div class="field" id="location"> <label>Location</label> <input type="text" name="location" placeholder="Location"> </div> <div class="field" id="description"> <label>Description</label> <textarea name="description"></textarea> </div> <div class="two fields"> <div class="field" id="website_url"> <label>Organization URL</label> <input type="text" name="website_url" placeholder="https://organization.com"> </div> <div class="field" id="linkedin_url"> <label>LinkedIn URL</label> <input type="text" name="linkedin_url" placeholder="https://www.linkedin.com/company/organization"> </div> </div> <div class="two fields"> <div class="field" id="twitter_url"> <label>Twitter URL</label> <input type="text" name="twitter_url" placeholder="https://twitter.com/organization"> </div> <div class="field" id="github_url"> <label>Github URL</label> <input type="text" name="github_url" placeholder="https://github.com/organization"> </div> </div> <div class="ui error message"></div> <div class="ui primary button" onclick="{save.bind(this)}" id="submit_button">Submit</div> <a href="{self.organization.url}"> <button type="button" class="ui button">Back to Organization Page</button> </a> </form> </div>', '', '', function(opts) {
        self = this
        self.organization = organization
        self.original_org_photo_name = typeof self.organization.photo !== 'undefined' ? null : self.organization.photo.replace(/\\/g, '/').replace(/.*\//, '')
        self.original_org_photo = self.organization.photo
        delete self.organization.photo

        self.one("mount", function () {
            self.submit_button = $('#submit_button')
            $.fn.form.settings.rules.test_http = function(param) {
                return /^(http|https):\/\/(.*)/.test(param)
            }

            $('#organization-form').form('set values', {
                name: self.organization.name,
                email: self.organization.email,
                location: self.organization.location,
                description: self.organization.description,
                website_url: self.organization.website_url,
                linkedin_url: self.organization.linkedin_url,
                twitter_url: self.organization.twitter_url,
                github_url: self.organization.github_url,
            })

            $('#organization-form').form({
                keyboardShortcuts: false,
                fields: {
                    name: {
                        identifier: 'name',
                        optional: false,
                        rules: [{
                            type: 'empty'
                        }]
                    },
                    email: {
                        identifier: 'email',
                        optional: false,
                        rules: [{
                            type: 'email',
                            prompt: 'Please enter a valid {name}'
                        }]
                    },
                    website_url: {
                        identifier: 'website_url',
                        optional: true,
                        rules: [
                            {
                                type: 'url',
                                prompt: 'Please enter a valid {name}. Example: https://organization.com'
                            },
                            {
                                type: 'test_http',
                                prompt: '{name} must start with "http://" or "https://"'
                            }
                        ]
                    },
                    twitter_url: {
                        identifier: 'twitter_url',
                        optional: true,
                        rules: [
                            {
                                type: 'url',
                                prompt: 'Please enter a valid {name}. Example: https://organization.com'
                            },
                            {
                                type: 'test_http',
                                prompt: '{name} must start with "http://" or "https://"'
                            }
                        ]
                    },
                    linkedin_url: {
                        identifier: 'linkedin_url',
                        optional: true,
                        rules: [
                            {
                                type: 'url',
                                prompt: 'Please enter a valid {name}. Example: https://www.linkedin.com/company/organization'
                            },
                            {
                                type: 'test_http',
                                prompt: '{name} must start with "http://" or "https://"'
                            }
                        ]
                    },
                    github_url: {
                        identifier: 'github_url',
                        optional: true,
                        rules: [
                            {
                                type: 'url',
                                prompt: 'Please enter a valid {name}. Example: https://github.com/organization'
                            },
                            {
                                type: 'test_http',
                                prompt: '{name} must start with "http://" or "https://"'
                            }
                        ]
                    },
                },
                onSuccess: function () {
                    data = $('#organization-form').form('get values')
                    data.photo = self.org_photo
                    CODALAB.api.update_organization(data, self.organization.id)
                        .done(data => {
                            toastr.success("Organization Saved")
                            self.submit_button.prop('disabled', false)
                        })
                        .fail(data => {
                            let errorsJSON = data.responseJSON
                            let errors = []
                            for(let key in errorsJSON){
                                errors.push(self.camel_case_to_regular(key) + ' - ' + errorsJSON[key])
                                $('#'+key).addClass('error')
                            }
                            $('#organization-form').form('add errors', errors)
                            self.submit_button.prop('disabled', false)
                        })
                    return false
                },
                onFailure: function () {
                    self.submit_button.prop('disabled', false)
                }
            })

            $(self.refs.photo).change(function () {
                self.logo_file_name = self.refs.photo.value.replace(/\\/g, '/').replace(/.*\//, '')
                self.update()
                getBase64(this.files[0]).then(function (data) {
                    self.org_photo = JSON.stringify({file_name: self.logo_file_name, data: data})
                })
            })
        })

        self.camel_case_to_regular = (str) => {
            str = str.replaceAll('_', ' ')
            return str.replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase())
        }

        self.save = () => {
            self.submit_button.prop('disabled', true)
            $('#organization-form').form('validate form')
        }
});

riot.tag2('organization-invite', '<div class="ui raised segment"> <h1 class="ui dividing header">Organization Invite</h1> <div if="{state === \'loading\'}" class="ui placeholder"> <div class="paragraph"> <div class="line"></div> <div class="line"></div> <div class="line"></div> <div class="line"></div> <div class="line"></div> </div> </div> <div if="{state === \'invite_valid\'}"> <div class="ui items"> <div class="item"> <div class="content"> <div class="description"> Would you like to accept invite to <strong>{invite_data.organization_name}</strong> </div> <div class="extra">Invite Sent {invite_data.date_joined}</div> <div class="extra"> <div onclick="{accept_invite}" class="ui left floated positive button"> Accept <i class="right check icon"></i> </div> <div onclick="{reject_invite}" class="ui right floated negative button"> Reject <i class="right x icon"></i> </div> </div> </div> </div> </div> </div> <div if="{state === \'invite_not_found\'}"> <div class="ui items"> <div class="item"> <div class="content"> <div class="description"> <h3 class="header">Invite Not Found</h3> </div> <div class="extra"> <a href="/"><button class="ui right floated button primary">Return Home</button></a> </div> </div> </div> </div> </div> <div if="{state === \'user_invite_mismatch\'}"> <div class="ui items"> <div class="item"> <div class="content"> <div class="description"> <h3 class="header">This invite is not for the user logged in.</h3> <div class="text"> Please make sure you are logged into the correct account, or have organization administrator send you an invite. </div> </div> <div class="extra"> <a href="/"><button class="ui right floated button primary">Return Home</button></a> </div> </div> </div> </div> </div> <div if="{state === \'already_accepted\'}"> <div class="ui center aligned items"> <div class="item"> <div class="content"> <div class="description"> <h3 class="header">Invite has already been accepted</h3> <div class="text"> Redirecting you to the competition in 3 seconds. </div> <div class="ui active centered inline loader"></div> </div> <div class="extra"> <a href="/"><button class="ui right floated button primary">Return Home</button></a> </div> </div> </div> </div> </div> <div if="{state === \'unknown_error\'}"> <div class="ui items"> <div class="item"> <div class="content"> <div class="description"> <h3 class="header">Unknown Error.</h3> <div class="text"> This invite could not be validated. If you think this is an error please contact the administrator or create a issue on the <a href="https://github.com/codalab/competitions-v2">CODALAB GITHUB</a>. </div> </div> <div class="extra"> <a href="/"><button class="ui right floated button primary">Return Home</button></a> </div> </div> </div> </div> </div> </div>', '', '', function(opts) {
        self = this
        self.state = 'loading'
        self.queryString = window.location.search
        self.urlParams = new URLSearchParams(self.queryString)
        self.data = {token: self.urlParams.get('token')}

        self.one('mount', () => {
            CODALAB.api.validate_organization_invite(self.data)
                .done((data) => {
                    self.invite_data = data
                    self.state = 'invite_valid'
                    setTimeout(self.update, 250)
                })
                .fail((response) => {
                    if (response.status === 301){
                        self.state = 'already_accepted'
                        let org_url = response.responseJSON.redirect_url
                        if (org_url === undefined) {
                            org_url = '/'
                        }
                        setTimeout((redirect_url = org_url) => {
                            window.location.href = redirect_url
                        }, 3250)
                    }
                    else if (response.status === 400){
                        self.state = 'invite_not_found'
                    }
                    else if (response.status === 403){
                        self.state = 'user_invite_mismatch'
                    }
                    else {
                        self.state = 'unknown_error'
                    }
                    setTimeout(self.update, 250)
                })
        })

        self.accept_invite = () => {
            CODALAB.api.update_organization_invite(self.data, 'POST')
                .done((data) => {
                    if (data.redirect_url !== undefined) {
                        window.location.href = data.redirect_url
                    } else {
                        window.location.href = '/'
                    }

                })
                .fail((response) => {
                    toastr.error('Oops! An error has occurred. Try refreshing and then trying again.')
                })
        }
        self.reject_invite = () => {
            data = {}
            CODALAB.api.update_organization_invite(self.data, 'DELETE')
                .done((data) => {
                    window.location.href = '/'
                })
                .fail((response) => {
                    toastr.error('Oops! An error has occurred. Try refreshing and then trying again.')
                })
        }
});

riot.tag2('organization-user-management', '<div class="ui raised segment"> <h1 class="ui dividing header">User Management:</h1> <div class="ui right floated small green button" id="invite-user-button" onclick="{invite_users.bind(this)}"> Invite Users <i class="user plus icon right"></i> </div> <table class="ui striped table"> <thead> <tr> <th>Name</th> <th>E-mail</th> <th>Date Joined</th> <th>Group</th> <th>Remove</th> </tr> </thead> <tbody> <tr each="{user in members}"> <td><a href="/profiles/user/{user.user.slug}/">{user.user.name}</a></td> <td><a href="mailto:{user.user.email}">{user.user.email}</a></td> <td>{user.date_joined}</td> <td if="{user[\'group\'] !== \'OWNER\' && user[\'group\'] !== \'INVITED\'}"> <span> <div class="ui inline dropdown"> <div class="text">{capitalize(user[\'group\'])} </div> <i class="dropdown icon"></i> <div class="menu"> <div class="header">Adjust Member Permissions</div> <div class="item" data-member="{user.id}" data-value="MANAGER">Manager</div> <div class="item" data-member="{user.id}" data-value="PARTICIPANT">Participant</div> <div class="item" data-member="{user.id}" data-value="MEMBER">Member</div> </div> </div> <div class="ui tiny inline loader"></div> </span> </td> <td if="{user[\'group\'] === \'OWNER\' || user[\'group\'] === \'INVITED\'}"> <span class="text">{capitalize(user[\'group\'])}</span> </td> <td if="{user[\'group\'] !== \'OWNER\'}"><button class="ui mini icon negative button" onclick="{delete_member.bind(this, user.id, user.user.name)}"> <i class="x icon"></i> </button></td> <td if="{user[\'group\'] === \'OWNER\'}"></td> </tr> </tbody> </table> <div class="ui mini modal" ref="confirm_delete"> <div class="header">Please Confirm</div> <div class="content"> Are you want to remove <strong>{pending_member_name}</strong> from <strong>{organization_name}</strong>? </div> <div class="actions"> <div class="ui negative button">Remove Member</div> <div class="ui ok button">Cancel</div> </div> </div> <div class="ui modal" ref="invite_users"> <div class="ui header">Invite Users</div> <div class="content"> <select class="ui fluid search multiple selection dropdown" multiple id="user_search"> <i class="dropdown icon"></i> <div class="default text">Select Collaborator</div> <div class="menu"> </div> </select> </div> <div class="actions"> <div class="ui positive button">Invite Users</div> <div class="ui cancel button">Cancel</div> </div> </div> </div>', 'organization-user-management #invite-user-button,[data-is="organization-user-management"] #invite-user-button{ position: absolute; top: 14px; right: 14px; }', '', function(opts) {
        self_manage = this
        self_manage.members = organization.members
        self_manage.organization_name = organization.name
        self_manage.organization_id = organization.id
        self_manage.pending_member_name = ''

        self_manage.one("mount", function () {
            $('.ui.inline.dropdown').dropdown({
                onChange: function (value, text, choice) {
                    let loader = $(choice).parent().parent().parent().find('.loader')
                    loader.addClass('active')
                    let data = {
                        group: value,
                        membership: choice.data('member'),
                    }
                    CODALAB.api.update_user_group(data, self_manage.organization_id)
                        .done((data) => {
                            setTimeout(()=>{
                                loader.removeClass('active')
                            }, 750)
                        })
                        .fail((response) => {
                            toastr.error('Failed to edit user')
                        })
                }
            })

            $(self_manage.refs.confirm_delete).modal({
                onDeny: function () {
                    CODALAB.api.delete_organization_member(self_manage.organization_id, {membership: self_manage.pending_member_id})
                        .done((data) => {
                            self_manage.members = self_manage.members.filter(user => user.id !== self_manage.pending_member_id)
                            self_manage.update()
                            self_manage.pending_member_id = undefined
                            self_manage.pending_member_name = undefined
                            return true
                        })
                        .fail((response) => {
                            toastr.error('Failed to remove member.')
                            self_manage.pending_member_id = undefined
                            self_manage.pending_member_name = undefined
                            return true
                        })
                },
            })

            $('#user_search').dropdown({
                apiSettings: {
                    url: `${URLS.API}user_lookup/?q={query}`,
                },
                clearable: true,
                preserveHTML: false,
                fields: {
                    title: 'name',
                    value: 'id',
                },
                cache: false,
                maxResults: 5,
            })
            $(self_manage.refs.invite_users).modal({
                onApprove: function () {
                    let users = $('#user_search').dropdown('get value')
                    CODALAB.api.invite_user_to_organization(self_manage.organization_id, {users: users})
                        .done((data) => {
                            toastr.success('Invites Sent')
                            location.reload()
                        })
                        .fail((response) => {
                            toastr.error('An error has occurred')
                            return true
                        })
                }
            })
        })

        self_manage.capitalize = (str) => {
            return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        }

        self_manage.delete_member = (id, username) => {
            self_manage.pending_member_id = id
            self_manage.pending_member_name = username
            self_manage.update()
            $(self_manage.refs.confirm_delete)
                .modal('show')
        }

        self_manage.invite_users = () => {
            $(self_manage.refs.invite_users)
                .modal('show')
        }
});

riot.tag2('profile-account', '<div id="delete-account"> <h2 class="title danger">Delete account</h2> <div class="ui divider"></div> <p><b>Warning:</b> Deleting your account is permanent and cannot be undone. All your personal data, settings, and content will be permanently erased, and you will lose access to all services linked to your account. Please make sure to back up any important information before proceeding.</p> <button type="button" class="ui button delete-button" ref="delete_button" onclick="{show_modal.bind(this, \'.delete-account.modal\')}">Permanently delete my account</button> </div> <div class="ui delete-account modal tiny" ref="delete_account_modal"> <div class="header">Are you sure you want to do this ?</div> <div class="ui bottom attached negative message"> <i class="exclamation triangle icon"></i> This is extremely important. </div> <div class="content"> <p>By clicking <b>"Delete my account"</b> you will receive a confirmation email to proceed with your account deletion. <br><br> This action is irreversible: all personal data will be permanently deleted or anonymized, <b>except for competitions and submissions</b> retained under the platform\'s user agreement. <br><br> If you wish to delete your submissions or competitions, please do so before deleting your account. <br><br> You will also no longer be eligible for any cash prizes in competitions you are participating in. <br><br> You will not be able to re-create an account using the same email address for 30 days. </p> <div class="ui divider"></div> <form class="ui form" id="delete-account-form" onsubmit="{handleDeleteAccountSubmit}"> <div class="required field"> <label for="username">Your username</label> <input type="text" id="username" name="username" required oninput="{checkFields}"> </div> <div class="required field"> <label for="confirmation">Type <i>delete my account</i> to confirm</label> <input type="text" id="confirmation" name="confirmation" required oninput="{checkFields}"> </div> <div class="required field"> <label for="password">Confirm your password</label> <input type="password" id="password" name="password" required> </div> <button class="ui button fluid delete-button" type="submit" disabled="{isDeleteAccountSubmitButtonDisabled}">Delete my account</button> </form> </div> </div>', 'profile-account .title,[data-is="profile-account"] .title{ font-size: 24px; font-weight: 600; color: #24292f; } profile-account .danger,[data-is="profile-account"] .danger{ color: #db2828; } profile-account .delete-button,[data-is="profile-account"] .delete-button{ color: #db2828 !important; } profile-account .delete-button:hover,[data-is="profile-account"] .delete-button:hover{ background-color: #db2828 !important; color: #fff !important; }', '', function(opts) {
        self = this;
        self.user = user;

        self.isDeleteAccountSubmitButtonDisabled = true;

        self.show_modal = selector => $(selector).modal('show');
        self.hide_modal = selector => $(selector).modal('hide');

        self.checkFields = function() {
            const formValues = $('#delete-account-form').form('get values');
            const username = formValues.username;
            const confirmation = formValues.confirmation;

            if (username === self.user.username && confirmation === "delete my account") {
                self.isDeleteAccountSubmitButtonDisabled = false;
            } else {
                self.isDeleteAccountSubmitButtonDisabled = true;
            }

            self.update();
        }

        handleDeleteAccountSubmit = function(event) {
            event.preventDefault();

            const formValues = $('#delete-account-form').form('get values');

            CODALAB.api.request_delete_account(formValues)
                .done(function (response) {
                    const success = response.success;
                    if (success) {
                        toastr.success(response.message);
                        self.hide_modal('.delete-account.modal')
                    } else {
                        toastr.error(response.error);
                    }
                })
                .fail(function () {
                    toastr.error("An error occured. Please contact administrators");
                })
        }
});
riot.tag2('profile-detail', '<div class="background"> <div id="profile_wrapper" class="ui two column doubling stackable grid container"> <div class="column"> <div if="{!selected_user.photo}"><img id="avatar" class="ui centered small rounded image" src="/static/img/user-avatar.png"></div> <div if="{selected_user.photo}"><img id="avatar" class="ui centered small rounded image" riot-src="{selected_user.photo}"></div> <div class="ui horizontal divider">Organizations</div> <div each="{org in selected_user.organizations}" class="ui fluid card"> <div class="comp_card center aligned image"> <div class="comp_header center aligned header content"> <div class="comp_name">{org.name}</div> <img class="ui centered mini circular image" riot-src="{org.photo}"> </div> </div> <div class="content"> <div class="description"> <p>{org.description.length > 225 ? org.description.substring(0, 222) + ⁗...⁗ : org.description}</p> </div> </div> <div class="right aligned extra content"> <a class="status" href="/profiles/organization/{org.id}/"> View Organization <i class="angle right icon"></i> </a> </div> </div> </div> <div class="eight wide column"> <div id="horiz-margin" class="ui horizontal divider">Personal Info</div> <div if="{selected_user.first_name && selected_user.last_name}" class="about-block"> <div class="flex-container"> <div class="label">Name</div> <div class="value">{selected_user.first_name} {selected_user.last_name}</div> </div> </div> <div if="{selected_user.id === CODALAB.state.user.id}"> <div if="{selected_user.email}" class="about-block"> <div class="flex-container"> <div class="label">Email</div> <div class="value">{selected_user.email}</div> </div> </div> <div if="{selected_user.username}" class="about-block"> <div class="flex-container"> <div class="label">Username</div> <div class="value">{selected_user.username}</div> </div> </div> <div if="{selected_user.display_name}" class="about-block"> <div class="flex-container"> <div class="label">Display Name</div> <div class="value">{selected_user.display_name}</div> </div> </div> </div> <div id="horiz-margin" class="ui horizontal divider">About</div> <div if="{selected_user.location}" class="about-block"> <div class="flex-container"> <div class="label"></i>Location</div> <div class="value">{selected_user.location}</div> </div> </div> <div if="{selected_user.title}" class="about-block"> <div class="flex-container"> <div class="label">Job Title</div> <div class="value">{selected_user.title}</div> </div> </div> <span if="{!selected_user.location && !selected_user.title}" class="text-placeholder">Update your profile to show your job title and location here.</span> <div id="horiz-margin" class="ui horizontal divider">Bio</div> <div if="{selected_user.biography}" class="ui justified container">{selected_user.biography}</div> <span if="{!selected_user.biography}" class="text-placeholder">Update your profile to show your bio here.</span> <div id="horiz-margin" class="ui horizontal divider">Links</div> <div if="{selected_user.personal_url}" class="about-block"> <div class="flex-container"> <div class=""><i class="world icon"></i>Website:</div> <div class="value"> <a href="{selected_user.personal_url}" target="_blank">{selected_user.personal_url}</a> </div> </div> </div> <div if="{selected_user.github_url}" class="about-block"> <div class="flex-container"> <div class=""><i class="github icon"></i>GitHub:</div> <div class="value"> <a href="{selected_user.github_url}" target="_blank">{selected_user.github_url}</a> </div> </div> </div> <div if="{selected_user.linkedin_url}" class="about-block"> <div class="flex-container"> <div class=""><i class="linkedin icon"></i>LinkedIn:</div> <div class="value"> <a href="{selected_user.linkedin_url}" target="_blank">{selected_user.linkedin_url}</a> </div> </div> </div> <div if="{selected_user.twitter_url}" class="about-block"> <div class="flex-container"> <div class=""><i class="twitter icon"></i>Twitter:</div> <div class="value"> <a href="{selected_user.twitter_url}" target="_blank">{selected_user.twitter_url}</a> </div> </div> </div> <span if="{!selected_user.personal_url && !selected_user.github_url && !selected_user.linkedin_url && !selected_user.twitter_url}" class="text-placeholder">Update your profile to show your social links here.</span> </div> </div> </div>', 'profile-detail,[data-is="profile-detail"]{ margin-top: 20px; } profile-detail #avatar,[data-is="profile-detail"] #avatar{ border: solid 1px #000; max-height: 200px; max-width: 200px; } profile-detail .ui.horizontal.divider,[data-is="profile-detail"] .ui.horizontal.divider{ color: #9e9e9e !important; } profile-detail .terminal,[data-is="profile-detail"] .terminal{ color: #9e9e9e; } profile-detail .comp_header,[data-is="profile-detail"] .comp_header{ margin: 5px; } profile-detail .comp_card,[data-is="profile-detail"] .comp_card{ background: #008000; } profile-detail .comp_name,[data-is="profile-detail"] .comp_name{ font-weight: bold; font-size: 24px; vertical-align: -15px; text-align: center; margin: 10px 0; } profile-detail .exchange,[data-is="profile-detail"] .exchange{ color: #008000; } profile-detail .status,[data-is="profile-detail"] .status{ color: #008000 !important; } profile-detail .ui.basic.fluid.button,[data-is="profile-detail"] .ui.basic.fluid.button{ margin-bottom: 10px; } profile-detail .header.content,[data-is="profile-detail"] .header.content{ font-size: 30px; font-weight: bolder; } profile-detail .ui.justified.container,[data-is="profile-detail"] .ui.justified.container{ margin-top: 30px; font-size: 12px; } profile-detail .two.wide.column,[data-is="profile-detail"] .two.wide.column{ margin-bottom: -5px; font-weight: bold; } profile-detail .fourteen.wide.column,[data-is="profile-detail"] .fourteen.wide.column{ margin-bottom: -5px; } profile-detail #horiz-margin,[data-is="profile-detail"] #horiz-margin{ margin-top: 30px; } profile-detail #grid-margin,[data-is="profile-detail"] #grid-margin{ margin-top: 20px; } profile-detail .world.icon,[data-is="profile-detail"] .world.icon{ color: #808080; } profile-detail .twitter.icon,[data-is="profile-detail"] .twitter.icon{ color: #1da1f2; } profile-detail .github.icon,[data-is="profile-detail"] .github.icon{ color: #6e5494; } profile-detail .linkedin.icon,[data-is="profile-detail"] .linkedin.icon{ color: #0077b5; } profile-detail .social-block,[data-is="profile-detail"] .social-block{ margin-bottom: 10px; margin-top: 5px; } profile-detail .about-block,[data-is="profile-detail"] .about-block{ margin-top: 10px; display: flex; flex-direction: column; } profile-detail .flex-container,[data-is="profile-detail"] .flex-container{ display: flex; flex-direction: row; } profile-detail .text-placeholder,[data-is="profile-detail"] .text-placeholder{ color: #9e9e9e; } profile-detail .label,[data-is="profile-detail"] .label{ width: 100px; color: #999; } profile-detail .value,[data-is="profile-detail"] .value{ font-size: 15px; margin-left: 10px; }', '', function(opts) {
        self.selected_user = selected_user
});

riot.tag2('profile-edit', '<div class="ui raised segment"> <h1>User Edit:</h1> <form class="ui form" id="user-form"> <div class="field"> <label>Profile Photo</label> <label show="{photo}"> Uploaded Photo: <a href="{photo}" target="_blank">{photo_name}</a> </label> <div class="ui left action file input"> <button class="ui icon button" type="button" onclick="document.getElementById(\'profile_phtoto\').click()"> <i class="attach icon"></i> </button> <input id="profile_phtoto" type="file" ref="photo" accept="image/*"> <input riot-value="{logo_file_name}" readonly onclick="document.getElementById(\'profile_phtoto\').click()"> </div> </div> <div class="two fields"> <div class="field" id="first_name"> <label>First Name</label> <input type="text" name="first_name" placeholder="First Name"> </div> <div class="field" id="last_name"> <label>Last Name</label> <input type="text" name="last_name" placeholder="Last Name"> </div> </div> <div class="two fields"> <div class="field" id="display_name"> <label>Display Name</label> <input type="text" name="display_name" placeholder="Display Name"> </div> <div class="field" id="title"> <label>Job Title</label> <input type="text" name="title" placeholder="Job Title"></div> </div> <div class="field" id="location"> <label>Location</label> <input type="text" name="location" placeholder="Location"></div> <div class="field" id="email"> <label>Email</label> <input disabled type="text" name="email" placeholder="Email"> </div> <div class="two fields"> <div class="field" id="personal_url"> <label>Personal Website</label> <input type="text" name="personal_url" placeholder="Personal URL"> </div> <div class="field" id="twitter_url"> <label>Twitter URL</label> <input type="text" name="twitter_url" placeholder="Twitter URL"> </div> </div> <div class="two fields"> <div class="field" id="linkedin_url"> <label>LinkedIn URL</label> <input type="text" name="linkedin_url" placeholder="LinkedIn URL"> </div> <div class="field" id="github_url"> <label>Github URL</label> <input type="text" name="github_url" placeholder="Github URL"> </div> </div> <div class="field" id="biography"> <label>Bio</label> <textarea name="biography"></textarea> </div> <div class="ui error message"></div> <button type="button" class="ui primary button" onclick="{save.bind(this)}" ref="submit_button">Submit</button> </form> </div>', '', '', function(opts) {
        self = this
        self.selected_user = selected_user
        self.photo = self.selected_user.photo
        delete self.selected_user.photo
        self.one("mount", function () {

            $.fn.form.settings.rules.test_http = function(param) {
                return /^(http|https):\/\/(.*)/.test(param)
            }

            $('#user-form').form('set values', {
                first_name:     selected_user.first_name,
                last_name:      selected_user.last_name,
                email:          selected_user.email,
                display_name:   selected_user.display_name,
                personal_url:   selected_user.personal_url,
                twitter_url:    selected_user.twitter_url,
                linkedin_url:   selected_user.linkedin_url,
                github_url:     selected_user.github_url,
                title:          selected_user.title,
                location:       selected_user.location,
                biography:      selected_user.biography,
                })
             $('#user-form').form({
                 keyboardShortcuts: false,
                 fields: {
                    email: {
                        identifier: 'email',
                        optional: true
                    },
                     personal_url: {
                         identifier: 'personal_url',
                         optional: true,
                         rules: [
                             {
                                 type: 'url',
                                 prompt: 'Please enter a valid url. Example: https://www.xyz.com'
                             },
                             {
                                 type: "test_http",
                                 prompt: '{name} must start with "http://" or "https://"'
                             }
                         ]
                     },
                     twitter_url: {
                         identifier: 'twitter_url',
                         optional: true,
                         rules: [
                             {
                                 type: 'url',
                                 prompt: 'Please enter a valid {name}. Example: https://twitter.com/BobRoss'
                             },
                             {
                                 type: "test_http",
                                 prompt: '{name} must start with "http://" or "https://"'
                             }
                         ]
                     },
                     linkedin_url: {
                         identifier: 'linkedin_url',
                         optional: true,
                         rules: [
                             {
                                 type: 'url',
                                 prompt: 'Please enter a valid {name}. Example: https://www.linkedin.com/in/john-doe'
                             },
                             {
                                 type: "test_http",
                                 prompt: '{name} must start with "http://" or "https://"'
                             }
                         ]
                     },
                     github_url: {
                         identifier: 'github_url',
                         optional: true,
                         rules: [
                             {
                                 type: 'url',
                                 prompt: 'Please enter a valid {name}. Example: https://github.com/john-doe'
                             },
                             {
                                 type: "test_http",
                                 prompt: '{name} must start with "http://" or "https://"'
                             }
                         ]
                     },
                 },
                 onSuccess: function () {

                     const formValues = $('#user-form').form('get values')

                     delete formValues.email;

                     _.extend(self.selected_user, formValues)
                     CODALAB.api.update_user_details(self.selected_user.id, self.selected_user)
                         .done(data => {
                             toastr.success("Details Saved")
                             window.location.href = data
                         })
                         .fail(data => {
                             let errorsJSON = data.responseJSON
                             let errors = []
                             for(let key in errorsJSON){
                                 errors.push(self.camel_case_to_regular(key) + ' - ' + errorsJSON[key])
                                 $('#'+key).addClass('error')
                             }
                             $('#user-form').form('add errors', errors)
                             self.refs.submit_button.disabled = false
                         })
                     return false
                 },
                 onFailure: function (){
                     self.refs.submit_button.disabled = false
                 }
             })

            self.photo_name = typeof self.photo == 'undefined' || self.photo === null ? null : self.photo.replace(/\\/g, '/').replace(/.*\//, '')

            $(self.refs.photo).change(function () {
                self.logo_file_name = self.refs.photo.value.replace(/\\/g, '/').replace(/.*\//, '')
                self.update()
                getBase64(this.files[0]).then(function (data) {
                    self.selected_user['photo'] = JSON.stringify({file_name: self.logo_file_name, data: data})
                })
            })
            self.update()
        })

        self.camel_case_to_regular = (str) => {
            str = str.replaceAll('_', ' ')
            return str.replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase())
        }

        self.save = () => {
            self.refs.submit_button.disabled = true
            $('#user-form').form('validate form')
        }
});

riot.tag2('queues-list', '<div class="ui horizontal list"> <div class="item"> <div class="ui icon input"> <input type="text" placeholder="Search by name..." ref="search" onkeyup="{filter.bind(this, undefined)}"> <i class="search icon"></i> </div> </div> <div class="item"> <div class="ui checkbox" onclick="{filter.bind(this, undefined)}"> <label>Show Public Queues</label> <input type="checkbox" ref="public"> </div> </div> <div class="item"> <help_button href="https://docs.codabench.org/latest/Organizers/Running_a_benchmark/Queue-Management/" tooltip_position="right center"> </help_button> </div> </div> <div class="ui green right floated labeled icon button" onclick="{show_modal.bind(this, undefined)}"> <i class="add circle icon"></i> Create Queue </div> <table class="ui {selectable: queues.length > 0} celled compact table"> <thead> <tr> <th>Name</th> <th width="150px">Owner</th> <th width="125px">Created</th> <th width="50px">Public</th> <th class="right aligned" width="150px">Actions</th> </tr> </thead> <tbody> <tr each="{queue in queues}" class="queue-row"> <td>{queue.name}</td> <td>{queue.owner}</td> <td>{timeSince(Date.parse(queue.created_when))} ago</td> <td class="center aligned"> <i class="checkmark box icon green" if="{queue.is_public}"></i> </td> <td class="right aligned"> <span data-tooltip="View Queue Details"> <i class="grey icon eye popup-button" if="{!!queue.broker_url}" onclick="{show_broker_modal.bind(this, queue)}"></i> </span> <span data-tooltip="Copy Broker URL"> <i class="icon copy outline popup-button" if="{!!queue.broker_url}" onclick="{copy_queue_url.bind(this, queue)}"></i> </span> <span data-tooltip="Edit Queue"> <i class="blue icon edit popup-button" if="{queue.is_owner && !!queue.broker_url}" onclick="{show_modal.bind(this, queue)}"></i> </span> <span data-tooltip="Delete Queue"> <i class="red icon trash alternate outline popup-button" if="{queue.is_owner && !!queue.broker_url}" onclick="{delete_queue.bind(this, queue)}"></i> </span> </td> </tr> <tr if="{queues.length === 0}"> <td class="center aligned" colspan="5"> <em>No Queues Yet!</em> </td> </tr> </tbody> <tfoot> <tr if="{queues.length > 0 && ( _.get(pagination, \'next\') || _.get(pagination, \'previous\') )}"> <th colspan="5"> <div class="ui right floated pagination menu" if="{queues.length > 0}"> <a show="{!!_.get(pagination, \'previous\')}" class="icon item" onclick="{previous_page}"> <i class="left chevron icon"></i> </a> <div class="item"> <label>{page}</label> </div> <a show="{!!_.get(pagination, \'next\')}" class="icon item" onclick="{next_page}"> <i class="right chevron icon"></i> </a> </div> </th> </tr> </tfoot> </table> <a href="/server_status" target="_blank"> <div class="ui blue right floated button">Open Server status page</div> </a> <div class="ui modal" ref="modal"> <div class="header"> Queue Form </div> <div class="content"> <form class="ui form" ref="form"> <div class="required field"> <label>Name</label> <input name="name" placeholder="Name" ref="queue_name"> </div> <div class="field"> <div class="ui checkbox"> <label>Make Public?</label> <input type="checkbox" ref="queue_public"> </div> </div> <div class="field"> <label>Collaborators</label> <select name="collaborators" class="ui fluid search multiple selection dropdown" multiple ref="collab_search"> <i class="dropdown icon"></i> <div class="default text">Select Collaborator</div> <div class="menu"> </div> </select> </div> </form> </div> <div class="actions"> <div class="ui primary button" onclick="{handle_queue}">Submit</div> <div class="ui basic red cancel button" onclick="{close_modal}">Cancel</div> </div> </div> <div class="ui modal" ref="broker_modal"> <div class="header"> Queue Details </div> <div class="content"> <h4>Broker URL:</h4> <span>{selected_queue.broker_url}</span> <h4>Vhost:</h4> <span>{selected_queue.vhost}</span> <h4 if="{_.get(selected_queue, \'competitions.length\', 0)}">Competitions using this queue:</h4> <ul if="{_.get(selected_queue, \'competitions.length\', 0)}"> <li each="{comp in selected_queue.competitions}"> <a class="link-no-deco" target="_blank" href="../competitions/{comp.id}">{comp.title}</a> </li> </ul> </div> <div class="actions"> <div class="ui cancel button" onclick="{close_broker_modal}">Close</div> </div> </div>', 'queues-list .popup-button,[data-is="queues-list"] .popup-button{ cursor: pointer; }', '', function(opts) {
        var self = this
        self.queues = []
        self.selected_queue = {}
        self.page = 1

        self.one("mount", function () {
            self.update_queues()
            $(".ui.checkbox", self.root).checkbox()
            $(self.refs.collab_search).dropdown({
                apiSettings: {
                    url: `${URLS.API}user_lookup/?q={query}`,
                },
                clearable: true,
                preserveHTML: false,
                fields: {
                    title: 'name',
                    value: 'id',
                },
                cache: false,
                maxResults: 5,
            })
            $(self.refs.modal).modal({
                onHidden: () => {
                    self.clear_form()
                }
            })
            $(self.refs.broker_modal).modal({
                onHidden: () => {
                    self.selected_queue = {}
                    self.update()
                }
            })
        })

        self.update_queues = function (filters) {
            filters = filters || {}
            let show_public_queues = $(self.refs.public).prop('checked')
            if (show_public_queues) {
                filters.public = true
            }
            CODALAB.api.get_queues(filters)
                .done(function (data) {
                    self.queues = _.orderBy(data.results, queue => !queue.is_owner);
                    self.pagination = {
                        "count": data.count,
                        "next": data.next,
                        "previous": data.previous
                    }
                    self.update()
                })
                .fail(function (response) {
                    toastr.error("Could not load queues")
                })
        }

        self.show_modal = (queue) => {
            if (queue !== undefined && queue !== null) {
                self.set_selected_queue(queue)
            }
            $(self.refs.modal).modal('show')
        }

        self.close_modal = () => {
            $(self.refs.modal).modal('hide')
        }

        self.close_broker_modal = () => {
            $(self.refs.broker_modal).modal('hide')
        }

        self.clear_form = function() {
            $(self.refs.collab_search).dropdown('clear')
            self.refs.queue_name.value = null
            self.selected_queue = {}
            self.refs.queue_public.checked = false
        }

        self.show_broker_modal = (queue) => {
            self.selected_queue = queue
            self.update()
            $(self.refs.broker_modal).modal('show')
        }

        self.set_selected_queue = function (queue) {
            self.selected_queue = queue
            self.refs.queue_name.value = queue.name
            $(self.refs.collab_search)
                .dropdown('setup menu',
                {
                    values: _.map(queue.organizers, function(o) {
                        return {id: o.id, name: o.username}
                    })
                })
                .dropdown('set selected', _.map(queue.organizers, o => o.id.toString()))

            if (queue.is_public) {
                self.refs.queue_public.checked = true
            }
        }

        self.handle_queue = function () {
            let data = {
                name: self.refs.queue_name.value,
                is_public: self.refs.queue_public.checked,
                organizers: $(self.refs.collab_search).dropdown('get value')
            }
            let endpoint = !_.isEmpty(self.selected_queue)
                ? CODALAB.api.update_queue
                : CODALAB.api.create_queue
            endpoint(data, _.get(self.selected_queue, 'id'))
                .done(function (response) {
                    toastr.success("Success!")
                    self.close_modal()

                    self.page = 1
                    self.update_queues()
                })
                .fail(function (response) {
                    toastr.error("An error occurred!")
                })
        }

        self.filter = function (filters) {
            filters = filters || {}
            _.defaults(filters, {
                search: $(self.refs.search).val(),
                page: 1,
            })
            self.page = filters.page
            self.update_queues(filters)
        }

        self.next_page = function () {
            if (!!self.pagination.next) {
                self.page += 1
                self.filter({page: self.page})
            }
        }
        self.previous_page = function () {
            if (!!self.pagination.previous) {
                self.page -= 1
                self.filter({page: self.page})
            }
        }

        self.delete_queue = function (queue) {
            if (confirm(`Are you sure you want to delete the queue: "${queue.name}"?`)) {
                CODALAB.api.delete_queue(queue.id)
                    .done(function () {
                        self.update_queues()
                        toastr.success("Queue deleted successfully!")
                    })
                    .fail(function () {
                        toastr.error("Could not delete queue!")
                    })
            }
        }

        self.copy_queue_url = function (queue) {
            navigator.clipboard.writeText(queue.broker_url).then(function () {

                toastr.success("Successfully copied broker url to clipboard!")
            }, function () {

                toastr.error("Failed to copy broker url to clipboard!")
            });
        }
});

riot.tag2('quota-management', '<div class="ui segment p-4"> <div class="ui" style="display: flex; flex-direction: row; align-items: center;"> <h2 style="margin-bottom: 0;">Quota and Cleanup</h2> <div style="flex: 0 0 auto; margin-left: auto;"> Quota: {pretty_bytes(storage_used)} / {quota} GB </div> </div> <table class="ui celled compact table"> <tbody> <tr> <td>Unused Tasks <span show="{unused_tasks > 0}">(<b>{unused_tasks}</b>)</span></td> <td> <button class="ui red right floated labeled icon button {disabled: unused_tasks === 0}" onclick="{delete_unused_tasks}"> <i class="icon trash"></i> Delete unused tasks </button> </td> </tr> <tr> <td>Unused Datasets and Programs <span show="{unused_datasets_programs > 0}">(<b>{unused_datasets_programs}</b>)</span></td> <td> <button class="ui red right floated labeled icon button {disabled: unused_datasets_programs === 0}" onclick="{delete_unused_datasets}"> <i class="icon trash"></i> Delete unused datasets/programs </button> </td> </tr> <tr> <td>Unused Submissions <span show="{unused_submissions > 0}">(<b>{unused_submissions}</b>)</span></td> <td> <button class="ui red right floated labeled icon button {disabled: unused_submissions === 0}" onclick="{delete_unused_submissions}"> <i class="icon trash"></i> Delete unused submissions </button> </td> </tr> <tr> <td>Failed Submissions <span show="{failed_submissions > 0}">(<b>{failed_submissions}</b>)</span></td> <td> <button class="ui red right floated labeled icon button {disabled: failed_submissions === 0}" onclick="{delete_failed_submissions}"> <i class="icon trash"></i> Delete failed submissions </button> </td> </tr> </tbody> </table> </div>', '', '', function(opts) {

        let self = this
        self.unused_tasks = 0
        self.unused_datasets_programs = 0
        self.unused_submissions = 0
        self.failed_submissions = 0
        self.quota = 0
        self.storage_used = 0

        self.on('mount', () => {
            self.update()
            self.get_cleanup()
            self.get_quota()
        })

        self.get_cleanup = function () {
            CODALAB.api.get_user_quota_cleanup()
                .done(function (data) {
                    self.unused_tasks = data.unused_tasks
                    self.unused_datasets_programs = data.unused_datasets_programs
                    self.unused_submissions = data.unused_submissions
                    self.failed_submissions = data.failed_submissions
                    self.update()
                })
                .fail(function (response) {
                    toastr.error("Could not load cleanup data")
                })
        }

        self.get_quota = function () {
            CODALAB.api.get_user_quota()
                .done(function (data) {
                    self.quota = data.quota
                    self.storage_used = data.storage_used
                    self.update()
                })
                .fail(function (response) {
                    toastr.error("Could not load quota")
                })
        }

        self.delete_unused_tasks = function(){
            if (confirm(`Are you sure you want to permanently delete all unused tasks?`)) {

                CODALAB.api.delete_unused_tasks()
                    .done(function (data) {
                        if(data.success){
                            self.unused_tasks = 0
                            toastr.success(data.message)
                            self.update()
                            CODALAB.events.trigger('reload_tasks')
                            CODALAB.events.trigger('reload_datasets')
                            self.get_cleanup()
                        }else{
                            toastr.error(data.message)
                        }
                    })
                    .fail(function (response) {
                        toastr.error("Unsed tasks deletion failed!")
                    })
            }
        }

        self.delete_unused_datasets = function(){
            if (confirm(`Are you sure you want to permanently delete all unused datasets and programs?`)) {

                CODALAB.api.delete_unused_datasets()
                    .done(function (data) {
                        if(data.success){
                            self.unused_datasets_programs = 0
                            toastr.success(data.message)
                            self.update()
                            CODALAB.events.trigger('reload_datasets')
                        }else{
                            toastr.error(data.message)
                        }
                    })
                    .fail(function (response) {
                        toastr.error("Unused datasets and programs deletion failed!")
                    })
            }
        }

        self.delete_unused_submissions = function(){
            if (confirm(`Are you sure you want to permanently delete all unused submissions?`)) {

                CODALAB.api.delete_unused_submissions()
                    .done(function (data) {
                        if(data.success){
                            self.unused_submissions = 0
                            toastr.success(data.message)
                            self.update()
                            CODALAB.events.trigger('reload_submissions')
                        }else{
                            toastr.error(data.message)
                        }
                    })
                    .fail(function (response) {
                        toastr.error("Unused submissions deletion failed!")
                    })
            }
        }

        self.delete_failed_submissions = function(){
            if (confirm(`Are you sure you want to permanently delete all failed submissions?`)) {

                CODALAB.api.delete_failed_submissions()
                    .done(function (data) {
                        if(data.success){
                            self.failed_submissions = 0
                            toastr.success(data.message)
                            self.update()
                            CODALAB.events.trigger('reload_submissions')
                        }else{
                            toastr.error(data.message)
                        }
                    })
                    .fail(function (response) {
                        toastr.error("Failed submissions deletion failed!")
                    })
            }
        }

        CODALAB.events.on('reload_quota_cleanup', self.get_cleanup)

});

riot.tag2('submission-management', '<div class="ui icon input"> <input type="text" placeholder="Search..." ref="search" onkeyup="{filter.bind(this, undefined)}"> <i class="search icon"></i> </div> <div class="ui checkbox inline-div" onclick="{filter.bind(this, undefined)}"> <label>Show Public</label> <input type="checkbox" ref="show_public"> </div> <button class="ui green right floated labeled icon button" onclick="{show_creation_modal}"> <i class="plus icon"></i> Add Submission </button> <button class="ui red right floated labeled icon button {disabled: marked_submissions.length === 0}" onclick="{delete_submissions}"> <i class="icon delete"></i> Delete Selected Submissions </button> <table id="submissionsTable" class="ui {selectable: submissions.length > 0} celled compact sortable table"> <thead> <tr> <th>File Name</th> <th>Competition in</th> <th width="175px">Size</th> <th width="125px">Uploaded</th> <th width="60px" class="no-sort">Public</th> <th width="50px" class="no-sort">Delete?</th> <th width="25px" class="no-sort"></th> </tr> </thead> <tbody> <tr each="{submission, index in submissions}" class="submission-row" onclick="{show_info_modal.bind(this, submission)}"> <td>{submission.file_name || submission.name}</td> <td if="{submission.competition}"><a class="link-no-deco" target="_blank" href="../competitions/{submission.competition.id}">{submission.competition.title}</a></td> <td if="{!submission.competition}"></td> <td>{pretty_bytes(submission.file_size)}</td> <td>{timeSince(Date.parse(submission.created_when))} ago</td> <td class="center aligned"> <i class="checkmark box icon green" show="{submission.is_public}"></i> </td> <td class="center aligned"> <button show="{submission.created_by === CODALAB.state.user.username}" class="ui mini button red icon" onclick="{delete_submission.bind(this, submission)}"> <i class="icon delete"></i> </button> </td> <td class="center aligned"> <div show="{submission.created_by === CODALAB.state.user.username}" class="ui fitted checkbox"> <input type="checkbox" name="delete_checkbox" onclick="{mark_submission_for_deletion.bind(this, submission)}"> <label></label> </div> </td> </tr> <tr if="{submissions.length === 0}"> <td class="center aligned" colspan="6"> <em>No Submissions Yet!</em> </td> </tr> </tbody> <tfoot> <tr> <th colspan="8" if="{submissions.length > 0}"> <div class="ui right floated pagination menu" if="{submissions.length > 0}"> <a show="{!!_.get(pagination, \'previous\')}" class="icon item" onclick="{previous_page}"> <i class="left chevron icon"></i> </a> <div class="item"> <label>{page}</label> </div> <a show="{!!_.get(pagination, \'next\')}" class="icon item" onclick="{next_page}"> <i class="right chevron icon"></i> </a> </div> </th> </tr> </tfoot> </table> <div ref="info_modal" class="ui modal"> <div class="header"> {selected_row.file_name || selected_row.name} </div> <div class="content"> <h3>Details</h3> <table class="ui basic table"> <thead> <tr> <th>Key</th> <th>Competition in</th> <th>Created By</th> <th>Created</th> <th>Type</th> <th>Public</th> </tr> </thead> <tbody> <tr> <td>{selected_row.key}</td> <td if="{selected_row.competition}"><a class="link-no-deco" target="_blank" href="../competitions/{selected_row.competition.id}">{selected_row.competition.title}</a></td> <td if="{!selected_row.competition}"></td> <td><a href="/profiles/user/{selected_row.created_by}/" target="_blank">{selected_row.owner_display_name}</a></td> <td>{pretty_date(selected_row.created_when)}</td> <td>{_.startCase(selected_row.type)}</td> <td>{_.startCase(selected_row.is_public)}</td> </tr> </tbody> </table> <virtual if="{!!selected_row.description}"> <div>Description:</div> <div class="ui segment"> {selected_row.description} </div> </virtual> <table class="ui compact basic table"> <thead> <tr> <th colspan="2">File Sizes</th> </tr> </thead> <tbody> <tr> <td style="width: 180px;">Submission:</td> <td>{pretty_bytes(selected_row.submission_file_size)}</td> </tr> <tr> <td>Prediction result:</td> <td>{pretty_bytes(selected_row.prediction_result_file_size)}</td> </tr> <tr> <td>Scoring result:</td> <td>{pretty_bytes(selected_row.scoring_result_file_size)}</td> </tr> <tr> <td>Detailed result:</td> <td>{pretty_bytes(selected_row.detailed_result_file_size)}</td> </tr> </tbody> </table> </div> <div class="actions"> <button show="{selected_row.created_by === CODALAB.state.user.username}" class="ui primary icon button" onclick="{toggle_is_public}"> <i class="share icon"></i> {selected_row.is_public ? ⁗Make Private⁗ : ⁗Make Public⁗} </button> <a href="{URLS.DATASET_DOWNLOAD(selected_row.key)}" class="ui green icon button"> <i class="download icon"></i>Download File </a> <button class="ui cancel button">Close</button> </div> </div> <div ref="submission_creation_modal" class="ui modal"> <div class="header">Add Submission Form</div> <div class="content"> <div class="ui message error" show="{Object.keys(errors).length > 0}"> <div class="header"> Error(s) creating submission </div> <ul class="list"> <li each="{error, field in errors}"> <strong>{field}:</strong> {error} </li> </ul> </div> <form class="ui form coda-animated {error: errors}" ref="form"> <input-text name="name" ref="name" error="{errors.name}" placeholder="Name"></input-text> <input-text name="description" ref="description" error="{errors.description}" placeholder="Description"></input-text> <input type="hidden" name="type" ref="type" value="submission"> <input-file name="data_file" ref="data_file" error="{errors.data_file}" accept=".zip"></input-file> </form> <div class="ui indicating progress" ref="progress"> <div class="bar"> <div class="progress">{upload_progress}%</div> </div> </div> </div> <div class="actions"> <button class="ui blue icon button" onclick="{check_form}"> <i class="upload icon"></i> Upload </button> <button class="ui basic red cancel button">Cancel</button> </div> </div>', 'submission-management .submission-row:hover,[data-is="submission-management"] .submission-row:hover{ cursor: pointer; }', '', function(opts) {
        var self = this
        self.mixin(ProgressBarMixin)

        self.errors = []
        self.submissions = []
        self.selected_row = {}
        self.marked_submissions = []

        self.upload_progress = undefined

        self.page = 1

        self.one("mount", function () {
            $(".ui.dropdown", self.root).dropdown()
            $(".ui.checkbox", self.root).checkbox()
            $('#submissionsTable').tablesort()
            self.update_submissions()
        })

        self.show_info_modal = function (row, e) {

            if (e.target.type === 'checkbox') {
                return
            }
            self.selected_row = row
            self.update()
            $(self.refs.info_modal).modal('show')
        }

        self.show_creation_modal = function () {
            $(self.refs.submission_creation_modal).modal('show')
        }

        self.pretty_date = date => luxon.DateTime.fromISO(date).toLocaleString(luxon.DateTime.DATE_FULL)

        self.filter = function (filters) {
            filters = filters || {}
            _.defaults(filters, {
                search: $(self.refs.search).val(),
                page: 1,
            })
            self.page = filters.page
            self.update_submissions(filters)
        }

        self.next_page = function () {
            if (!!self.pagination.next) {
                self.page += 1
                self.filter({page: self.page})
            } else {
                alert("No valid page to go to!")
            }
        }
        self.previous_page = function () {
            if (!!self.pagination.previous) {
                self.page -= 1
                self.filter({page: self.page})
            } else {
                alert("No valid page to go to!")
            }
        }

        self.update_submissions = function (filters) {
            filters = filters || {}
            filters._public = $(self.refs.show_public).prop('checked')
            filters._type = "submission"
            CODALAB.api.get_datasets(filters)
                .done(function (data) {
                    self.submissions = data.results
                    self.pagination = {
                        "count": data.count,
                        "next": data.next,
                        "previous": data.previous
                    }
                    self.update()
                })
                .fail(function (response) {
                    toastr.error("Could not load submissions...")
                })
        }

        self.delete_submission = function (submission, e) {
            name = submission.file_name || submission.name
            if (confirm(`Are you sure you want to delete '${name}'?`)) {
                CODALAB.api.delete_dataset(submission.id)
                    .done(function () {
                        self.update_submissions()
                        toastr.success("Submission deleted successfully!")
                        CODALAB.events.trigger('reload_quota_cleanup')
                    })
                    .fail(function (response) {
                        toastr.error(response.responseJSON['error'])
                    })
            }
            event.stopPropagation()
        }

        self.delete_submissions = function () {
            if (confirm(`Are you sure you want to delete multiple submissions?`)) {
                CODALAB.api.delete_datasets(self.marked_submissions)
                    .done(function () {
                        self.update_submissions()
                        toastr.success("Submission deleted successfully!")
                        self.marked_submissions = []
                        CODALAB.events.trigger('reload_quota_cleanup')
                    })
                    .fail(function (response) {
                        for (e in response.responseJSON) {
                            toastr.error(`${e}: '${response.responseJSON[e]}'`)
                        }
                    })
            }
            event.stopPropagation()
        }

        self.clear_form = function () {

            $(':input', self.refs.form)
                .not(':button, :submit, :reset, :hidden')
                .val('')
                .removeAttr('checked')
                .removeAttr('selected');

            self.errors = {}
            self.update()
        }

        self.check_form = function (event) {
            if (event) {
                event.preventDefault()
            }

            self.file_upload_progress_handler(undefined)

            self.errors = {}
            var validate_data = get_form_data(self.refs.form)

            var required_fields = ['name', 'type', 'data_file']
            required_fields.forEach(field => {
                if (validate_data[field] === '') {
                    self.errors[field] = "This field is required"
                }
            })

            if (Object.keys(self.errors).length > 0) {

                self.update()
                return
            }

            self.prepare_upload(self.upload)()

        }

        self.upload = function () {

            var metadata = get_form_data(self.refs.form)
            delete metadata.data_file

            if (metadata.is_public === 'on') {
                var public_confirm = confirm("You are creating a public submission. Are you sure you wish to continue?")
                if (!public_confirm) {
                    return
                }
            }

            var data_file = self.refs.data_file.refs.file_input.files[0]

            CODALAB.api.create_dataset(metadata, data_file, self.file_upload_progress_handler)
                .done(function (data) {
                    toastr.success("Submission successfully uploaded!")
                    self.update_submissions()
                    self.clear_form()
                    $(self.refs.submission_creation_modal).modal('hide')
                    CODALAB.events.trigger('reload_quota_cleanup')
                })
                .fail(function (response) {
                    if (response) {
                        try {
                            var errors = JSON.parse(response.responseText)

                            Object.keys(errors).map(function (key, index) {
                                errors[key] = errors[key].join('; ')
                            })

                            self.update({errors: errors})
                        } catch (e) {

                        }
                    }
                    toastr.error("Creation failed, error occurred")
                })
                .always(function () {
                    self.hide_progress_bar()
                })
        }

        self.toggle_is_public = () => {
            let message = self.selected_row.is_public
                ? 'Are you sure you want to make this submission private? It will no longer be available to other users.'
                : 'Are you sure you want to make this submission public? It will become visible to everyone'
            if (confirm(message)) {
                CODALAB.api.update_dataset(self.selected_row.id, {id: self.selected_row.id, is_public: !self.selected_row.is_public})
                    .done(data => {
                        toastr.success('Submission updated')
                        $(self.refs.info_modal).modal('hide')
                        self.filter()
                    })
                    .fail(resp => {
                        toastr.error(resp.responseJSON['is_public'])
                    })
            }
        }

        self.mark_submission_for_deletion = function(submission, e) {
            if (e.target.checked) {
                self.marked_submissions.push(submission.id)
            }
            else {
                self.marked_submissions.splice(self.marked_submissions.indexOf(submission.id), 1)
            }
        }

        CODALAB.events.on('reload_submissions', self.update_submissions)

});

riot.tag2('submission_management', '<h1>Submission Management</h1> <div class="ui divider"></div> <div class="stackable ui menu"> <div class="item"> <div class="ui icon input"> <input type="text" placeholder="Search Users..."> <i class="user icon"></i> </div> </div> <div class="ui right pushed search item"> <div class="ui icon input"> <input class="prompt" type="text" placeholder="Search Competitions..."> <i class="search icon"></i> </div> <div class="results"></div> </div> </div> <div id="horiz_buttons" class="ui horizontal icon buttons"> <button class="ui button" data-tooltip="Re-run Selected" data-position="top left"> <i class="refresh icon"></i> </button> <button class="ui button" data-tooltip="Stop Selected"> <i class="minus circle icon"></i> </button> <button class="ui button" data-tooltip="Delete Selected"> <i class="trash icon"></i> </button> </div> <div id="table_scroll" class="ui"> <div id="left_rail" class="ui left attached rail"> <div class="ui sticky"> <div class="ui vertical icon buttons"> <button class="ui right icon button" data-tooltip="Re-run Selected" data-position="right center"> <i class="refresh icon"></i> </button> <button class="ui right icon button" data-tooltip="Stop Selected" data-position="right center"> <i class="minus circle icon"></i> </button> <button class="ui right icon button" data-tooltip="Delete Selected" data-position="right center"> <i class="trash icon"></i> </button> </div> </div> </div> <table class="ui compact celled unstackable table"> <thead> <tr> <th> <div class="ui checkbox"> <input type="checkbox"><label></label> </div> </th> <th>File Name</th> <th>File Size</th> <th>Submitted at</th> <th>Processing Start</th> <th>Processing End</th> <th>Compute Worker</th> <th>Queue</th> <th>Docker Image</th> </tr> </thead> <tbody> <tr> <td class="collapsing"> <div class="ui checkbox"> <input type="checkbox"><label></label> </div> </td> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td> </tr> <tr> <td class="collapsing"> <div class="ui checkbox"> <input type="checkbox"><label></label> </div> </td> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td> </tr> <tr> <td class="collapsing"> <div class="ui checkbox"> <input type="checkbox"> <label></label> </div> </td> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td> </tr> <tr> <td class="collapsing"> <div class="ui checkbox"> <input type="checkbox"> <label></label> </div> </td> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td> </tr> <tr> <td class="collapsing"> <div class="ui checkbox"> <input type="checkbox"> <label></label> </div> </td> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td> </tr> <tr> <td class="collapsing"> <div class="ui checkbox"> <input type="checkbox"> <label></label> </div> </td> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td> </tr> <tr> <td class="collapsing"> <div class="ui checkbox"> <input type="checkbox"> <label></label> </div> </td> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td> </tr> <tr> <td class="collapsing"> <div class="ui checkbox"> <input type="checkbox"> <label></label> </div> </td> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td> </tr> <tr> <td class="collapsing"> <div class="ui checkbox"> <input type="checkbox"> <label></label> </div> </td> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td> </tr> <tr> <td class="collapsing"> <div class="ui checkbox"> <input type="checkbox"> <label></label> </div> </td> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td> </tr> </tbody> <tfoot class="full-width"> <tr> <th colspan="11"> <div class="ui right floated pagination menu"> <a class="icon item"><i class="left chevron icon"></i></a> <a class="item">1</a> <a class="item">2</a> <a class="item">3</a> <a class="item">4</a> <a class="icon item"><i class="right chevron icon"></i></a> </div> </th> </tr> </tfoot> </table> </div>', 'submission_management { width: 100%; } submission_management #table_scroll,[data-is="submission_management"] #table_scroll{ width: 100%; overflow-y: auto; white-space: nowrap; } submission_management .ui.left.attached.rail,[data-is="submission_management"] .ui.left.attached.rail{ padding-top: 157px; text-align: right; } submission_management .ui.right.icon.button,[data-is="submission_management"] .ui.right.icon.button{ border-top-right-radius: 0 !important; border-bottom-right-radius: 0 !important; } @media all and (max-width: 1235px) { submission_management #left_rail,[data-is="submission_management"] #left_rail{ display: none; } submission_management #horiz_buttons,[data-is="submission_management"] #horiz_buttons{ display: block; } } @media all and (min-width: 1235px) { submission_management .ui.compact.celled.unstackable.table,[data-is="submission_management"] .ui.compact.celled.unstackable.table{ border-top-left-radius: 0 !important; } submission_management #left_rail,[data-is="submission_management"] #left_rail{ display: block; } submission_management #horiz_buttons,[data-is="submission_management"] #horiz_buttons{ display: none; } }', '', function(opts) {
        $(document).ready(function () {
            $('#left_rail .ui.sticky')
                .sticky({
                    context: '.ui.compact.celled.table',
                    offset: 75
                })
        })
});

riot.tag2('task-management', '<div class="ui icon input"> <input type="text" placeholder="Search by name..." ref="search" onkeyup="{filter.bind(this, undefined)}"> <i class="search icon"></i> </div> <div class="ui checkbox" onclick="{filter.bind(this, undefined)}"> <label>Show Public Tasks</label> <input type="checkbox" ref="public"> </div> <div class="ui blue right floated labeled icon button" onclick="{show_upload_task_modal}"><i class="upload icon"></i> Upload Task </div> <div selenium="create-task" class="ui green right floated labeled icon button" onclick="{show_modal}"><i class="add circle icon"></i> Create Task </div> <button class="ui red right floated labeled icon button {disabled: marked_tasks.length === 0}" onclick="{delete_tasks}"> <i class="icon delete"></i> Delete Selected Tasks </button> <table id="tasksTable" class="ui {selectable: tasks.length > 0} celled compact sortable table"> <thead> <tr> <th>Name</th> <th>Description</th> <th>Creator</th> <th width="50px" class="no-sort">In Use</th> <th width="50px" class="no-sort">Public</th> <th width="100px" class="no-sort">Actions</th> <th width="25px" class="no-sort"></th> </tr> </thead> <tbody> <tr each="{task in tasks}" class="task-row"> <td onclick="{show_detail_modal.bind(this, task)}">{task.name}</td> <td onclick="{show_detail_modal.bind(this, task)}">{task.description}</td> <td><a href="/profiles/user/{task.created_by}/" target="_blank">{task.owner_display_name}</a></td> <td> <i class="checkmark box icon green" show="{task.is_used_in_competitions}"></i> </td> <td class="center aligned"> <i class="checkmark box icon green" show="{task.is_public}"></i> </td> <td> <div if="{task.created_by == CODALAB.state.user.username}"> <button class="mini ui button blue icon" onclick="{show_edit_modal.bind(this, task)}"> <i class="icon pencil"></i> </button> <button class="mini ui button red icon" onclick="{delete_task.bind(this, task)}"> <i class="icon trash"></i> </button> </div> </td> <td class="center aligned"> <div class="ui fitted checkbox" if="{task.created_by == CODALAB.state.user.username}"> <input type="checkbox" name="delete_checkbox" onclick="{mark_task_for_deletion.bind(this, task)}"> <label></label> </div> </td> </tr> <tr if="{tasks.length === 0}"> <td class="center aligned" colspan="4"> <em>No Tasks Yet!</em> </td> </tr> </tbody> <tfoot> <tr if="{tasks.length > 0}"> <th colspan="7"> <div class="ui right floated pagination menu" if="{tasks.length > 0}"> <a show="{!!_.get(pagination, \'previous\')}" class="icon item" onclick="{previous_page}"> <i class="left chevron icon"></i> </a> <div class="item"> <label>{page}</label> </div> <a show="{!!_.get(pagination, \'next\')}" class="icon item" onclick="{next_page}"> <i class="right chevron icon"></i> </a> </div> </th> </tr> </tfoot> </table> <div class="ui modal" ref="detail_modal"> <div class="header"> {selected_task.name} <button class="ui right floated primary button" onclick="{open_share_modal.bind(this)}"> Share Task <i class="share square icon right"></i> </button> </div> <div class="content"> <h4>{selected_task.description}</h4> <div class="ui divider" show="{selected_task.description}"></div> <div><strong>Created By:</strong> <a href="/profiles/user/{selected_task.created_by}/" target="_blank">{selected_task.owner_display_name}</a></div> <div><strong>Uploaded:</strong> {timeSince(Date.parse(selected_task.created_when))} ago</div> <div if="{selected_task.created_by === CODALAB.state.user.username}"> <strong>Shared With:</strong> {selected_task.shared_with.join(\', \')} </div> <div if="{selected_task.created_by === CODALAB.state.user.username}"> <strong>Used in Competitions:</strong> <ul show="{selected_task.competitions.length > 0}"> <li each="{comp in selected_task.competitions}"> <a href="{URLS.COMPETITION_DETAIL(comp.id)}" target="_blank">{comp.title}</a> </li> </ul> </div> <div><strong>Key:</strong> {selected_task.key}</div> <div><strong>Has Been Validated <span data-tooltip="A task has been validated once one of its solutions has successfully been run against it"> <i class="question circle icon"></i> </span>:</strong> {selected_task.validated ? ⁗Yes⁗ : ⁗No⁗}</div> <div><strong>Is Public:</strong> {selected_task.is_public ? ⁗Yes⁗ : ⁗No⁗}</div> <div if="{selected_task.created_by === CODALAB.state.user.username}" class="ui right floated small green icon button" onclick="{toggle_task_is_public}"> <i class="share icon"></i> {selected_task.is_public ? \'Make Private\' : \'Make Public\'} </div> <div class="ui secondary pointing green two item tabular menu"> <div class="active item" data-tab="files">Files</div> <div class="item" data-tab="solutions">Solutions</div> </div> <div class="ui active tab" data-tab="files"> <table class="ui table"> <thead> <tr> <th>Type</th> <th>Name</th> <th></th> </tr> </thead> <tbody> <tr each="{file in file_types}" if="{selected_task[file]}"> <td>{selected_task[file].type}</td> <td>{selected_task[file].name}</td> <td class="collapsing"> <span data-tooltip="Download this dataset"> <a href="{URLS.DATASET_DOWNLOAD(selected_task[file].key)}"> <i class="download green icon"></i> </a> </span> </td> </tr> </tbody> </table> </div> <div class="ui tab" data-tab="solutions"> <table class="ui table"> <thead> <tr> <th>Solutions</th> </tr> </thead> <tbody> <tr each="{solution in selected_task.solutions}"> <td><a href="{URLS.DATASET_DOWNLOAD(solution.data)}">{solution.name}</a></td> </tr> </tbody> </table> </div> </div> <div class="actions"> <button class="ui cancel button">Close</button> </div> </div> <div ref="upload_task_modal" class="ui modal"> <div class="header">Upload Task</div> <div class="content"> <form class="ui form coda-animated {error: errors}" ref="upload_form"> <p> Upload a zip of your task here to create a new task. For assistance check the documentation <a href="https://docs.codabench.org/latest/Organizers/Running_a_benchmark/Resource-Management/#upload-a-task" target="_blank">here</a>. </p> <input-file name="data_file" ref="data_file" accept=".zip"></input-file> </form> <div class="ui indicating progress" ref="progress"> <div class="bar"> <div class="progress">{upload_progress}%</div> </div> </div> </div> <div class="actions"> <button class="ui blue icon button" onclick="{check_upload_task_form}"> <i class="upload icon"></i> Upload </button> <button class="ui basic red button" onclick="{close_upload_task_modal}">Cancel</button> </div> </div> <div class="ui modal" ref="modal"> <div class="header"> Create Task </div> <div class="content"> <div class="ui pointing menu"> <div class="active item modal-item" data-tab="details">Details</div> <div class="item modal-item" data-tab="data">Datasets and programs</div> </div> <form class="ui form" ref="form"> <div class="ui active tab" data-tab="details"> <div class="required field"> <label>Name</label> <input selenium="name2" name="name" placeholder="Name" ref="name" onkeyup="{form_updated}"> </div> <div class="required field"> <label>Description</label> <textarea selenium="task-desc" rows="4" name="description" placeholder="Description" ref="description" onkeyup="{form_updated}"></textarea> </div> </div> <div class="ui tab" data-tab="data"> <div> <div class="two fields" data-no-js> <div class="field {required: file_field === \'scoring_program\'}" each="{file_field in [\'scoring_program\', \'ingestion_program\']}"> <label> {_.startCase(file_field)} </label> <div class="ui fluid left icon labeled input search dataset" data-name="{file_field}"> <i class="search icon"></i> <input type="text" class="prompt" id="{file_field}"> <div selenium="scoring-program" class="results"></div> </div> </div> </div> <div class="two fields" data-no-js> <div class="field" each="{file_field in [\'reference_data\', \'input_data\']}"> <label> {_.startCase(file_field)} </label> <div class="ui fluid left icon labeled input search dataset" data-name="{file_field}"> <i class="search icon"></i> <input type="text" class="prompt"> <div class="results"></div> </div> </div> </div> </div> </div> </form> </div> <div class="ui modal" ref="share_modal"> <div class="ui header">Share</div> <div class="content"> <select class="ui fluid search multiple selection dropdown" multiple id="share_search"> <i class="dropdown icon"></i> <div class="default text">Select a User to Share with</div> <div class="menu"> </div> </select> </div> <div class="actions"> <div class="ui positive button">Share</div> <div class="ui cancel button">Cancel</div> </div> </div> <div class="actions"> <div selenium="save-task" class="ui primary button {disabled: !modal_is_valid}" onclick="{create_task}">Create</div> <div class="ui basic red cancel button">Cancel</div> </div> </div> <div class="ui modal" ref="edit_modal"> <div class="header"> Update Task </div> <div class="content"> <div class="ui pointing menu"> <div class="active item modal-item" data-tab="edit_details">Details</div> <div class="item modal-item" data-tab="edit_data">Datasets and programs</div> </div> <form class="ui form" ref="edit_form"> <div class="ui active tab" data-tab="edit_details"> <div class="required field"> <label>Name</label> <input name="edit_name" placeholder="Name" ref="edit_name" riot-value="{selected_task.name}" onkeyup="{edit_form_updated}"> </div> <div class="required field"> <label>Description</label> <textarea rows="4" name="edit_description" placeholder="Description" ref="edit_description" riot-value="{selected_task.description}" onkeyup="{edit_form_updated}"></textarea> </div> </div> <div class="ui tab" data-tab="edit_data"> <div> <div class="two fields" data-no-js> <div class="field required"> <label>Scoring Program</label> <div class="ui fluid left icon labeled input search dataset" data-name="scoring_program"> <i class="search icon"></i> <input type="text" class="prompt" id="edit_scoring_program" riot-value="{selected_task.scoring_program?.name  || \'\'}" name="edit_scoring_program"> <div class="results"></div> </div> </div> <div class="field"> <label>Ingestion Program</label> <div class="ui fluid left icon labeled input search dataset" data-name="ingestion_program"> <i class="search icon"></i> <input type="text" class="prompt" id="edit_ingestion_program" riot-value="{selected_task.ingestion_program?.name  || \'\'}" name="edit_ingestion_program"> <div class="results"></div> </div> </div> </div> <div class="two fields" data-no-js> <div class="field"> <label>Reference Data</label> <div class="ui fluid left icon labeled input search dataset" data-name="reference_data"> <i class="search icon"></i> <input type="text" class="prompt" id="edit_reference_data" riot-value="{selected_task.reference_data?.name || \'\'}" name="edit_reference_data"> <div class="results"></div> </div> </div> <div class="field"> <label>Input Data</label> <div class="ui fluid left icon labeled input search dataset" data-name="input_data"> <i class="search icon"></i> <input type="text" class="prompt" id="edit_input_data" riot-value="{selected_task.input_data?.name  || \'\'}" name="edit_input_data"> <div class="results"></div> </div> </div> </div> </div> </div> </form> </div> <div class="content"> <div class="ui yellow message"> Note: It is the organizer\'s responsibility to rerun submissions on the updated task if needed. </div> </div> <div class="actions"> <div class="ui primary button {disabled: !edit_modal_is_valid}" onclick="{update_task}">Update</div> <div class="ui basic red cancel button">Cancel</div> </div> </div>', 'task-management .task-row,[data-is="task-management"] .task-row{ height: 42px; cursor: pointer; } task-management .benchmark-row,[data-is="task-management"] .benchmark-row{ overflow: hidden; white-space: nowrap; text-overflow: ellipsis; max-width: 125px; }', '', function(opts) {

        var self = this
        self.mixin(ProgressBarMixin)

        self.marked_tasks = []
        self.tasks = []
        self.form_datasets = {}
        self.selected_task = {}
        self.page = 1
        self.file_types = [
            'input_data',
            'reference_data',
            'scoring_program',
            'ingestion_program'
        ]

        self.upload_progress = undefined

        self.one("mount", function () {
            self.update_tasks()
            $(".ui.checkbox", self.root).checkbox()
            $('#tasksTable').tablesort()
            $('.ui.search.dataset', self.root).each(function (i, item) {
                $(item)
                    .search({
                        apiSettings: {
                            url: URLS.API + 'datasets/?search={query}&type=' + (item.dataset.name || ""),
                            onResponse: function (data) {
                                let results = _.map(data.results, result => {
                                    result.description = result.description || ''
                                    return result
                                })

                                return {results: results}
                            }
                        },
                        preserveHTML: false,
                        minCharacters: 2,
                        fields: {
                            title: 'name'
                        },
                        cache: false,
                        maxResults: 4,
                        onSelect: function (result, response) {

                            self.form_datasets[item.dataset.name] = result.key
                            self.form_updated()
                        }
                    })
            })

            $('#share_search').dropdown({
                apiSettings: {
                    url: `${URLS.API}user_lookup/?q={query}`,
                },
                clearable: true,
                preserveHTML: false,
                fields: {
                    title: 'name',
                    value: 'id',
                },
                cache: false,
                maxResults: 5,
            })

            $(self.refs.share_modal).modal({
                onApprove: function () {
                    let users = $('#share_search').dropdown('get value')
                    CODALAB.api.share_task(self.selected_task.id, {shared_with: users})
                        .done((data) => {
                            toastr.success('Task Shared')
                            $('#share_search').dropdown('clear')
                            CODALAB.api.get_task(self.selected_task.id)
                                .done((data) => {
                                    _.forEach(self.tasks, (task) => {
                                        if (task.id === self.selected_task.id) {
                                            task.shared_with = data.shared_with
                                            self.update()
                                            return false
                                        }
                                    })
                                })
                        })
                        .fail((response) => {
                            toastr.error('An error has occurred')
                            $('#share_search').dropdown('clear')
                            return true
                        })
                }

            })
        })

        self.show_upload_task_modal = () => {
            self.reset_upload_task_input()
            $(self.refs.upload_task_modal).modal('show')
        }
        self.close_upload_task_modal = () => {
            $(self.refs.upload_task_modal).modal('hide')
            self.reset_upload_task_input()
        }
        self.reset_upload_task_input = () => {

            $('input-file[ref="data_file"]').find("input").val('')

            self.hide_progress_bar()
        }
        self.show_modal = () => {
            $('.menu .item', self.root).tab('change tab', 'details')
            self.form_datasets = {}
            $(self.refs.modal).modal('show')

        }

        self.close_modal = () => {
            $(self.refs.modal).modal('hide')
            self.clear_form()
        }

        self.clear_form = () => {
            $(':input', self.refs.form)
                .not('[type="file"]')
                .not('button')
                .not('[readonly]').each(function (i, field) {
                $(field).val('')
            })
            self.form_datasets = {}
            self.modal_is_valid = false
        }

        self.check_upload_task_form = () => {

            var data_file = self.refs.data_file.refs.file_input.value

            if(data_file === undefined || !data_file.endsWith('.zip')) {
                toastr.warning("Please select a .zip file to upload")
                self.reset_upload_task_input()
                return
            }

            self.prepare_upload(self.upload_task)()
        }

        self.upload_task = () => {

            self.file_upload_progress_handler(undefined)

            var data_file = self.refs.data_file.refs.file_input.files[0]

            if(data_file === undefined || !data_file.name.endsWith('.zip')) {
                toastr.warning("Please select a .zip file to upload")
                return
            }

            CODALAB.api.upload_task(data_file, self.file_upload_progress_handler)
                .then(function () {
                    toastr.success("Task uploaded successfully")
                    setTimeout(function () {
                        CODALAB.events.trigger('reload_quota_cleanup')
                        CODALAB.events.trigger('reload_datasets')
                        self.close_upload_task_modal()
                        self.page = 1
                        self.update_tasks({page: self.page})
                    }, 500)

                })
                .catch(function (error) {
                    toastr.error("Task upload failed: " + error.responseJSON.error)
                    self.hide_progress_bar()
                })

        }

        self.create_task = () => {
            let data = get_form_data($(self.refs.form))
            _.assign(data, self.form_datasets)
            data.created_by = CODALAB.state.user.id
            CODALAB.api.create_task(data)
                .done((response) => {
                    toastr.success('Task Created')
                    self.close_modal()
                    self.page = 1
                    self.update_tasks({page: self.page})
                    CODALAB.events.trigger('reload_quota_cleanup')
                })
                .fail((response) => {
                    toastr.error('Error Creating Task')
                })
        }

        self.toggle_task_is_public = () => {
            let message = self.selected_task.is_public
                ? 'Are you sure you want to make this task private? It will no longer be available to other users.'
                : 'Are you sure you want to make this task public? It will become visible to everyone'
            if (confirm(message)) {
                CODALAB.api.update_task(self.selected_task.id, {id: self.selected_task.id, is_public: !self.selected_task.is_public})
                    .done(data => {
                        toastr.success('Task updated')
                        self.selected_task = data
                        self.update()
                    })
                    .fail(resp => {
                        toastr.error(resp.responseJSON['is_public'])
                    })
            }
        }

        self.form_updated = () => {
            self.modal_is_valid = $(self.refs.name).val() && $(self.refs.description).val() && self.form_datasets.scoring_program
            self.update()
        }

        self.show_detail_modal = (task, e) => {

            if (e.target.type === 'checkbox') {
                return
            }
            CODALAB.api.get_task(task.id)
                .done((data) => {
                    self.selected_task = data
                    self.update()
                })
            $(self.refs.detail_modal).modal('show')
        }

        self.show_edit_modal = (task, e) => {

            CODALAB.api.get_task(task.id)
                .done((data) => {
                    self.selected_task = data
                    self.update()

                    self.form_datasets = {}
                    if(self.selected_task.ingestion_program !== null){
                        self.form_datasets['ingestion_program'] = self.selected_task.ingestion_program.key
                    }
                    if(self.selected_task.scoring_program !== null){
                        self.form_datasets['scoring_program'] = self.selected_task.scoring_program.key
                    }
                    if(self.selected_task.reference_data !== null){
                        self.form_datasets['reference_data'] = self.selected_task.reference_data.key
                    }
                    if(self.selected_task.input_data !== null){
                        self.form_datasets['input_data'] = self.selected_task.input_data.key
                    }

                    self.edit_form_updated()

                    $(self.refs.edit_modal).modal('show')

                })
        }

        self.close_edit_modal = () => {
            $(self.refs.edit_modal).modal('hide')
            self.clear_edit_form()
        }

        self.edit_form_updated = () => {
            self.edit_modal_is_valid = $(self.refs.edit_name).val() && $(self.refs.edit_description).val()
            self.update()
        }

        self.clear_edit_form = () => {
            $(':input', self.refs.edit_form)
                .not('[type="file"]')
                .not('button')
                .not('[readonly]').each(function (i, field) {
                $(field).val('')
            })
            self.form_datasets = {}
            self.edit_modal_is_valid = false
        }
        self.update_task = () => {

            let data = get_form_data($(self.refs.edit_form))

            if(data.edit_scoring_program == ""){
                toastr.error('Scoring program is required in a task!')
                return
            }

            data.name = data.edit_name;
            data.description = data.edit_description;

            if(data.edit_ingestion_program != ""){
                data.ingestion_program = self.form_datasets.ingestion_program
            }

            if(data.edit_input_data != ""){
                data.input_data = self.form_datasets.input_data
            }

            if(data.edit_reference_data != ""){
                data.reference_data = self.form_datasets.reference_data
            }

            data.scoring_program = self.form_datasets.scoring_program

            delete data.edit_name
            delete data.edit_description
            delete data.edit_ingestion_program
            delete data.edit_scoring_program
            delete data.edit_input_data
            delete data.edit_reference_data

            task_id = self.selected_task.id
            CODALAB.api.update_task(task_id, data)
                .done((response) => {
                    toastr.success('Task Updated')
                    self.close_edit_modal()
                    self.update_tasks({page: self.page})
                    CODALAB.events.trigger('reload_quota_cleanup')
                })
                .fail((response) => {
                    toastr.error('Error Updating Task')
                })
        }

        self.filter = function (filters) {
            filters = filters || {}
            _.defaults(filters, {
                search: $(self.refs.search).val(),
                page: 1,
            })
            self.page = filters.page
            self.update_tasks(filters)
        }

        self.next_page = function () {
            if (!!self.pagination.next) {
                self.page += 1
                self.filter({page: self.page})
            } else {
                alert("No valid page to go to!")
            }
        }
        self.previous_page = function () {
            if (!!self.pagination.previous) {
                self.page -= 1
                self.filter({page: self.page})
            } else {
                alert("No valid page to go to!")
            }
        }

        self.update_tasks = function (filters) {
            filters = filters || {}
            let show_public_tasks = $(self.refs.public).prop('checked')
            if (show_public_tasks) {
                filters.public = true
            }
            CODALAB.api.get_tasks(filters)
                .done(function (data) {
                    self.tasks = data.results
                    self.pagination = {
                        "count": data.count,
                        "next": data.next,
                        "previous": data.previous
                    }
                    self.update()
                })
                .fail(function (response) {
                    toastr.error("Could not load tasks")
                })
        }

        self.search_tasks = function () {
            var filter = self.refs.search.value
            delay(() => self.update_tasks({search: filter}), 100)
        }

        self.delete_task = function (task) {
            if (confirm("Are you sure you want to delete '" + task.name + "'?\nSubmissions using this task cannot rerun! Results displayed on leaderboard can also be affected!")) {
                CODALAB.api.delete_task(task.id)
                    .done(function () {
                        self.update_tasks()
                        toastr.success("Task deleted successfully!")
                        CODALAB.events.trigger('reload_quota_cleanup')
                    })
                    .fail(function (response) {
                        toastr.error(response.responseJSON['error'])
                    })
            }
            event.stopPropagation()
        }

        self.delete_tasks = function () {
            if (confirm(`Are you sure you want to delete multiple tasks?\nSubmissions using these tasks cannot rerun! Results displayed on leaderboard can also be affected!`)) {
                CODALAB.api.delete_tasks(self.marked_tasks)
                    .done(function () {
                        self.update_tasks()
                        toastr.success("Tasks deleted successfully!")
                        self.marked_tasks = []
                        CODALAB.events.trigger('reload_quota_cleanup')
                    })
                    .fail(function (response) {
                        for (e in response.responseJSON) {
                            toastr.error(`${e}: '${response.responseJSON[e]}'`)
                        }
                    })
            }
            event.stopPropagation()
        }

        self.mark_task_for_deletion = function(task, e) {
            if (e.target.checked) {
                self.marked_tasks.push(task.id)
            }
            else {
                self.marked_tasks.splice(self.marked_tasks.indexOf(task.id), 1)
            }
        }

        self.open_share_modal = () => {
            $(self.refs.share_modal)
                .modal('show')
        }

        CODALAB.events.on('reload_tasks', self.update_tasks)

});

riot.tag2('task-detail', '<div class="ui segment"> <h1>{task.name}</h1> <div class="ui container"> <div style="font-size: 18px;">{task.description}</div> <div class="ui divider"></div> <div><strong>Created By:</strong> {task.created_by}</div> <div if="{task.created_by === CODALAB.state.user.username}"> <button class="ui blue right floated button" onclick="{edit_task}"> <i class="edit icon"></i>Edit </button> </div> <div><strong>Key:</strong> {task.key}</div> <div><strong>Is Public:</strong> <span show="{task.is_public}">Yes</span> <span show="{!task.is_public}">No</span> </div> </div> </div> <div class="ui secondary pointing green two item tabular menu"> <div class="active item" data-tab="files">Files</div> <div class="item" data-tab="solutions">Solutions</div> </div> <div class="ui active tab" data-tab="files"> <table class="ui table"> <thead> <tr> <th>Files</th> </tr> </thead> <tbody> <tr each="{file in task.files}"> <td><a href="{file.file_path}">{file.name}</a></td> </tr> </tbody> </table> </div> <div class="ui tab" data-tab="solutions"> <table class="ui table"> <thead> <tr> <th>Solutions</th> </tr> </thead> <tbody> <tr each="{solution in task.solutions}"> <td><a href="{solution.file_path}">{solution.data}</a></td> </tr> </tbody> </table> </div> <div class="ui modal" ref="modal"> <div class="header"> Edit </div> <div class="content"> <form class="ui form" ref="form"> <div class="required field"> <label>Name</label> <input type="text" riot-value="{task.name}" name="name"> </div> <div class="required field"> <label>Description</label> <input type="text" riot-value="{task.description}" name="description"> </div> <div class="field"> <div class="ui checkbox"> <input type="checkbox" name="is_public" checked="{task.is_public}"> <label>Public</label> </div> </div> <button type="submit" class="ui blue button" onclick="{submit_edit}">Save</button> </form> </div> </div>', '', '', function(opts) {
        var self = this

        self.task = {}

        self.on('mount', function () {
            $('.tabular.menu .item', self.root).tab()
            self.update_task()
        })

        self.update_task = function () {
            CODALAB.api.get_task(self.opts.task_pk)
                .done((data) => {
                    self.task = data
                    self.update()
                })
        }

        self.edit_task = function (event) {
            event.preventDefault()
            $(self.refs.modal).modal('show')
        }

        self.submit_edit = function (event) {
            event.preventDefault()
            let data = get_form_data(self.refs.form)
            data.is_public = $('[name="is_public"]', self.refs.form).is(':checked')

            CODALAB.api.update_task(self.task.id, data)
                .done(() => {
                    toastr.success('Changes Saved')
                    $(self.refs.modal).modal('hide')
                    self.update_task()
                })
                .fail((response) => {
                    toastr.error('Error saving changes')
                })
        }
});
