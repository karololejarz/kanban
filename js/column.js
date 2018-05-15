function Column(id, name) {
  var self = this;
  
  this.id = id;
  this.name = name || 'No name given';
  this.element = createColumn();

  function createColumn() {
    var column = $('<div class="column"></div>');
    var columnTitle = $('<h2 class="column-title">' + self.name + '</h2>');
    var columnCardList = $('<ul class="column-card-list"></ul>');
    var columnDelete = $('<button class="btn-delete"><i class="fas fa-trash-alt"></i></button>');
    var columnEdit = $('<button class="btn-edit"><i class="far fa-edit"></i></button>');
    var columnAddCard = $('<button class="column-add-card"><i class="far fa-plus-square"></i></button>');

    column.attr('id', self.id);
    column.attr('name', self.name);    
    
    columnDelete.click(function() {
      self.deleteColumn();
    });
    columnEdit.click(function() {
      self.editColumn();
    });
    
    columnAddCard.click(function(event) {
      var cardName = prompt("Enter the name of the card");
      event.preventDefault();
      $.ajax({
        url: baseUrl + '/card',
        method: 'POST',
        data: {
          name: cardName,
          bootcamp_kanban_column_id: self.id
        },
        success: function(response) {
          var card = new Card(response.id, cardName);
          self.createCard(card);
        }
      });
    });
      
    column.append(columnTitle)
      .append(columnDelete)
      .append(columnEdit)
      .append(columnAddCard)
      .append(columnCardList);
      return column;
    }
  }
Column.prototype = {
  createCard: function(card) {
    this.element.children('ul').append(card.element);
  },
  deleteColumn: function() {
    var self = this;
    $.ajax({
      url: baseUrl + '/column/' + self.id,
      method: 'DELETE',
      success: function(response){
        self.element.remove();
      }
    });
  },
  editColumn: function() {
    var self = this;
    var newColumnName = prompt('Enter a new name of the column', this.element.children("h2").text());
    $.ajax({
      url: baseUrl + '/column/' + self.id,
      method: 'PUT',
      data: {
        id: self.id,
        name: newColumnName,
      },
        success: function(response){
          self.element.children('h2').text(newColumnName);
        }
    });
  }
};