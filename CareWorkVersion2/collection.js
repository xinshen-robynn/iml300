$(document).ready(function () {

  // 点击 东 / 西 / 南 / 北
  $('.char').on('click', function () {
    const target = $(this).data('photo'); // east / west / south / north

    // 隐藏中间那张“东西南北小花”
    $('.collection-image').hide();

    // 隐藏四个方向字
    $('.char').hide();

    // 显示打开的折纸
    $('.detail-photo').show();
    $('.photo').hide();
    $('.photo-' + target).show();

    // 显示对应城市字（京/沪/蜀/粤）
    $('.city').hide();
    $('.city-' + target).show();

    // 所有素材 panel 先收起
    $('.asset-panel').hide();
    $('.asset-caption').hide();
    $('.asset-toggle').text('+');

    // 打开当前方向对应的素材 panel（比如 .asset-east）
    const panel = $('.asset-' + target);
    if (panel.length) {
      panel.show();
    }

    // 显示底部“返回”
    $('.back-btn').show();
  });

  // 点击“返回”
  $('.back-btn').on('click', function () {
    // 折纸 & 城市字都收起
    $('.detail-photo').hide();
    $('.photo').hide();
    $('.city').hide();

    // 素材 panel & 文本都收起
    $('.asset-panel').hide();
    $('.asset-caption').hide();
    $('.asset-toggle').text('+');

    // 返回按钮隐藏
    $('.back-btn').hide();

    // 回到最初的花 + 东西南北
    $('.collection-image').show();
    $('.char').show();
  });

  // ✅ 整个 asset-item（图 + +/- + 说明）一起拖动
  $('.asset-item').draggable({
    containment: '.collection-main',  // 限制在这一页
    scroll: false
  });

  // ✅ 点击 + / -：在图片下方展开 / 收起红底白字
  $('.asset-toggle').on('click', function (e) {
    e.stopPropagation();

    const $toggle  = $(this);
    const $caption = $toggle.siblings('.asset-caption');

    if ($caption.is(':visible')) {
      // 当前是打开 → 收起
      $caption.hide();
      $toggle.text('+');
    } else {
      // 当前是关闭 → 展开
      $caption.show();
      $toggle.text('-');
    }
  });

});
