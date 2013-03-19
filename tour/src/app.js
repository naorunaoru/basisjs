basis.require('basis.app');
basis.require('basis.ui');
basis.require('basis.router');
basis.require('basis.devpanel');  
basis.require('app.type');


var view;
module.exports = basis.app({
  init: function(){
    view = new basis.ui.Node({
      template: resource('app/template/layout.tmpl'),

      selection: true,
      childClass: {
        template: resource('app/template/slide.tmpl'),
        event_select: function(){
          basis.ui.Node.prototype.event_select.call(this);

          if (this.lazyChildNodes)
          {
            this.setChildNodes(this.lazyChildNodes());
            this.lazyChildNodes = null;
          }
        }
      },

      handler: {
        targetChanged: function(){
          this.getChildByName(this.target ? 'slide' : 'toc').select();
        }
      },

      childNodes: [
        {
          name: 'toc',
          selected: true,
          lazyChildNodes: resource('module/toc/index.js')
        },
        {
          name: 'slide',
          autoDelegate: true,
          lazyChildNodes: resource('module/slide/index.js')
        }
      ]
    });

    basis.router.add('*slide', function(slide){
      view.setDelegate(app.type.Slide.getSlot(slide + '.html'));
    });
    basis.router.start();

    return view.element;
  }
});

module.exports.selectSlide = function(slide){
  view.setDelegate(slide);
}