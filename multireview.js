(function multireviewModule() {
    "use strict";

    var each = Array.prototype.forEach.call.bind(Array.prototype.forEach);
    var filter = Array.prototype.filter.call.bind(Array.prototype.filter);

    each(document.querySelectorAll('select[multiple].multireview'), function multireviewInitializer(selectElt) {
        new MultiReview(selectElt);
    });

    function MultiReview(selectElt) {
        this.selectElt = selectElt;

        this.labels = {
            selected: selectElt.dataset.selectedLabel || 'Selected',
            unselected: selectElt.dataset.unselectedLabel || 'Unselected',
            toBeSelected: selectElt.dataset.toBeSelectedLabel || 'To be selected',
            toBeDeselected: selectElt.dataset.toBeDeselectedLabel || 'To be deselected',
        };

        createContainer.call(this);
        createWidget.call(this);
        createCurrentState.call(this);
        createUpcomingChanges.call(this);

        replaceSelectWithWidget.call(this);
    };

    function createContainer() {
        this.containerElt = document.createElement('div');
        this.containerElt.classList.add('multireview-container');
    }

    function createWidget() {
        this.widgetElt = document.createElement('div');
        this.widgetElt.classList.add('multireview-widget');
        this.containerElt.appendChild(this.widgetElt);
    }

    function createCurrentState() {
        var titleElt;

        this.currentStateElt = document.createElement('div');
        this.currentStateElt.classList.add('multireview-current-state');

        this.currentStateSelectedElt = document.createElement('div');
        titleElt = document.createElement('h3');
        titleElt.textContent = this.labels.selected;
        this.currentStateSelectedElt.appendChild(titleElt);
        this.selectedListElt = document.createElement('ul');
        this.selectedListElt.classList.add('multireview-list', 'selected');
        this.currentStateSelectedElt.appendChild(this.selectedListElt);

        this.currentStateUnselectedElt = document.createElement('div');
        titleElt = document.createElement('h3');
        titleElt.textContent = this.labels.unselected;
        this.currentStateUnselectedElt.appendChild(titleElt);
        this.unselectedListElt = document.createElement('ul');
        this.unselectedListElt.classList.add('multireview-list', 'unselected');
        this.currentStateUnselectedElt.appendChild(this.unselectedListElt);

        this.currentStateElt.appendChild(this.currentStateSelectedElt);
        this.currentStateElt.appendChild(this.currentStateUnselectedElt);

        each(this.selectElt.options, function appendListItem(optionElt) {
            var listElt = optionElt.selected ? this.selectedListElt : this.unselectedListElt;
            var listItemElt = optionToListItem(optionElt);
            listItemElt.dataset.currentState = optionElt.selected ? 'selected' : 'unselected';
            listItemElt.addEventListener('click', listItemListenerFor(this, optionElt));
            listElt.appendChild(listItemElt);
        }, this);

        this.widgetElt.appendChild(this.currentStateElt);
    }

    function createUpcomingChanges() {
        var titleElt;

        this.upcomingChangesElt = document.createElement('div');
        this.upcomingChangesElt.classList.add('multireview-upcoming-changes');

        this.upcomingChangesToBeSelectedElt = document.createElement('div');
        titleElt = document.createElement('h3');
        titleElt.textContent = this.labels.toBeSelected;
        this.upcomingChangesToBeSelectedElt.appendChild(titleElt);
        this.toBeSelectedListElt = document.createElement('ul');
        this.toBeSelectedListElt.classList.add('multireview-list', 'to-be-selected');
        this.upcomingChangesToBeSelectedElt.appendChild(this.toBeSelectedListElt);

        this.upcomingChangesToBeDeselectedElt = document.createElement('div');
        titleElt = document.createElement('h3');
        titleElt.textContent = this.labels.toBeDeselected;
        this.upcomingChangesToBeDeselectedElt.appendChild(titleElt);
        this.toBeDeselectedListElt = document.createElement('ul');
        this.toBeDeselectedListElt.classList.add('multireview-list', 'to-be-deselected');
        this.upcomingChangesToBeDeselectedElt.appendChild(this.toBeDeselectedListElt);

        this.upcomingChangesElt.appendChild(this.upcomingChangesToBeSelectedElt);
        this.upcomingChangesElt.appendChild(this.upcomingChangesToBeDeselectedElt);

        this.widgetElt.appendChild(this.upcomingChangesElt);
    }

    function replaceSelectWithWidget() {
        var parent = this.selectElt.parentNode;
        parent.insertBefore(this.containerElt, this.selectElt);
        parent.removeChild(this.selectElt);
        this.containerElt.appendChild(this.selectElt);
    }

    function optionToListItem(optionElt) {
        var listItemElt = document.createElement('li');
        listItemElt.innerHTML = optionElt.innerHTML;
        listItemElt.dataset.value = optionElt.value;
        return listItemElt;
    }

    function listItemListenerFor(multireview, optionElt) {
        return function listItemListener() {
            switch (this.dataset.currentState) {
                case 'selected':
                    this.parentNode.removeChild(this);
                    multireview.toBeDeselectedListElt.appendChild(this);
                    this.dataset.currentState = 'to-be-deselected';
                    optionElt.selected = false;
                    break;
                case 'unselected':
                    this.parentNode.removeChild(this);
                    multireview.toBeSelectedListElt.appendChild(this);
                    this.dataset.currentState = 'to-be-selected';
                    optionElt.selected = true;
                    break;
                case 'to-be-selected':
                    this.parentNode.removeChild(this);
                    multireview.unselectedListElt.appendChild(this);
                    this.dataset.currentState = 'unselected';
                    optionElt.selected = false;
                    break;
                case 'to-be-deselected':
                    this.parentNode.removeChild(this);
                    multireview.selectedListElt.appendChild(this);
                    this.dataset.currentState = 'selected';
                    optionElt.selected = true;
                    break;
                default:
                    throw new Error("unknown state '" + currentState + "'");
            }
        };
    }
}());
