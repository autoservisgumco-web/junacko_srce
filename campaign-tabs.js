(function () {
  if (!document.body.classList.contains('campaign-page')) return;

  const style = document.createElement('style');
  style.id = 'campaign-tabs-runtime-style';
  style.textContent = `
    body.campaign-page .campaign-hub{padding-top:4px}
    body.campaign-page .campaign-hub-heading{margin:0 0 10px}
    body.campaign-page .campaign-hub-heading h2{font-size:17px;margin:0;color:#52677e}
    body.campaign-page .campaign-hub-heading p{display:none}
    body.campaign-page .campaign-panel-grid{
      display:flex;flex-wrap:wrap;align-items:center;gap:7px;
      overflow-x:auto;overscroll-behavior-x:contain;
      scrollbar-width:none;padding:2px 0 8px;
    }
    body.campaign-page .campaign-panel-grid::-webkit-scrollbar{display:none}
    body.campaign-page .campaign-panel-card{
      display:inline-flex;align-items:center;gap:7px;flex:0 0 auto;
      min-height:42px;padding:9px 13px;border-radius:999px;
      box-shadow:none;background:#fff;border:1px solid #dce5ef;
      color:#52677e;white-space:nowrap;transform:none;
    }
    body.campaign-page .campaign-panel-card:hover{transform:none;box-shadow:none}
    body.campaign-page .campaign-panel-card[aria-selected="true"]{
      background:#e8f2ff;border-color:#8bb8e8;color:#174f88;
      box-shadow:inset 0 0 0 1px #b8d4f2;
    }
    body.campaign-page .campaign-panel-icon,
    body.campaign-page .campaign-panel-copy small,
    body.campaign-page .campaign-panel-arrow{display:none}
    body.campaign-page .campaign-panel-copy{display:block;flex:0 0 auto}
    body.campaign-page .campaign-panel-copy strong{font-size:14px;color:inherit}
    body.campaign-page .campaign-panel-count{padding:2px 6px;font-size:10px}
    body.campaign-page .campaign-tab-panel{
      width:min(1080px,calc(100% - 40px));box-sizing:border-box;
      margin:8px auto 20px;padding:22px 24px;background:#fff;
      border:1px solid #e0e8f1;border-radius:16px;
      box-shadow:0 6px 20px #102b4e08;min-height:90px;
    }
    body.campaign-page .campaign-tab-panel[hidden]{display:none!important}
    body.campaign-page .campaign-tab-panel h3{
      margin:0 0 14px;color:#163f70;font-size:21px
    }
    body.campaign-page .campaign-tab-panel .partner-cards{display:grid;gap:0}
    body.campaign-page .campaign-tab-panel .partner-card{
      display:flex;align-items:center;justify-content:space-between;
      flex-direction:row;gap:14px;padding:14px 0;border:0;
      border-bottom:1px solid #e8edf3;border-radius:0;background:transparent
    }
    body.campaign-page .campaign-tab-panel .partner-card:last-child{border-bottom:0}
    body.campaign-page .campaign-tab-panel .partner-card-copy{flex:1}
    body.campaign-page .campaign-tab-panel .partner-card-copy strong{font-size:16px}
    body.campaign-page .campaign-tab-panel .partner-card-copy p{font-size:13px}
    body.campaign-page .campaign-tab-panel .partner-open-button{
      width:auto;white-space:nowrap;padding:9px 12px;font-size:12px;
      border-radius:8px
    }
    body.campaign-page .campaign-joinbar{
      left:auto;right:14px;bottom:82px;width:auto;justify-content:flex-end;
      padding:0;background:transparent
    }
    body.campaign-page .campaign-joinbar .campaign-cta{
      width:auto;min-height:42px;padding:10px 16px;border-radius:999px;
      font-size:13px;box-shadow:0 4px 14px #061a3530
    }
    @media(max-width:760px){
      body.campaign-page .campaign-hub{width:calc(100% - 24px);margin:12px auto 0}
      body.campaign-page .campaign-hub-heading{padding:0 2px}
      body.campaign-page .campaign-panel-grid{flex-wrap:nowrap;margin-right:-1px}
      body.campaign-page .campaign-panel-card{min-height:40px;padding:8px 12px}
      body.campaign-page .campaign-panel-copy strong{font-size:13px}
      body.campaign-page .campaign-tab-panel{
        width:calc(100% - 24px);margin:8px auto 16px;
        padding:18px 15px;border-radius:14px
      }
      body.campaign-page .campaign-tab-panel h3{font-size:19px}
      body.campaign-page .campaign-tab-panel .partner-card{
        align-items:flex-start;flex-direction:column;gap:9px
      }
      body.campaign-page .campaign-tab-panel .partner-open-button{width:auto}
      body.campaign-page .campaign-joinbar{right:12px;bottom:82px}
      body.campaign-page .campaign-joinbar .campaign-cta{min-height:38px;padding:9px 13px;font-size:12px}
    }
  `;
  document.head.appendChild(style);

  const init = () => {
    const hub = document.querySelector('.campaign-hub');
    const grid = hub && hub.querySelector('.campaign-panel-grid');
    if (!hub || !grid || hub.dataset.tabsReady === 'true') return false;

    hub.dataset.tabsReady = 'true';
    const buttons = Array.from(grid.querySelectorAll('[data-campaign-panel]'));
    if (!buttons.length) return false;

    const panel = document.createElement('section');
    panel.className = 'campaign-tab-panel';
    panel.id = 'campaignTabPanel';
    panel.setAttribute('aria-live', 'polite');
    panel.innerHTML = '<p style="margin:0;color:#64748b">Изабери целину кампање да погледаш детаље.</p>';
    hub.insertAdjacentElement('afterend', panel);

    const activate = button => {
      buttons.forEach(item => {
        const selected = item === button;
        item.setAttribute('aria-selected', String(selected));
        item.classList.toggle('is-active', selected);
      });
    };

    buttons.forEach(button => {
      button.setAttribute('role', 'tab');
      button.setAttribute('aria-selected', 'false');
      button.addEventListener('click', event => {
        const key = button.dataset.campaignPanel;
        if (key === 'support') return; // Подршка остаје у постојећем доњем листу.
        if (button.dataset.tabLoaded === 'true') {
          event.preventDefault();
          event.stopImmediatePropagation();
          activate(button);
          panel.hidden = false;
          panel.scrollIntoView({behavior:'smooth',block:'nearest'});
          return;
        }

        activate(button);
        window.setTimeout(() => {
          const overlay = document.getElementById('campaignOverlay');
          const body = overlay && overlay.querySelector('#sheetBody');
          const title = overlay && overlay.querySelector('#sheetTitle');
          if (!body || !body.innerHTML.trim()) return;

          const content = body.innerHTML;
          const heading = title ? title.textContent : button.textContent.trim();
          panel.innerHTML = '<h3>' + heading + '</h3>' + content;
          button.dataset.tabLoaded = 'true';
          if (typeof window.closeCampaignSheet === 'function') window.closeCampaignSheet();
          panel.hidden = false;
          panel.scrollIntoView({behavior:'smooth',block:'nearest'});
        }, 40);
      }, true);
    });

    // Прва доступна секција се отвара као почетни садржај.
    const first = buttons.find(button => button.dataset.campaignPanel !== 'support');
    if (first) first.click();
    return true;
  };

  const observer = new MutationObserver(() => {
    if (init()) observer.disconnect();
  });
  const root = document.getElementById('campaignDetail');
  if (root) observer.observe(root, {childList:true,subtree:true});
  init();
})();