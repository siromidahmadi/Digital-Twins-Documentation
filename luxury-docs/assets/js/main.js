// assets/js/main.js
document.addEventListener('DOMContentLoaded', function(){
  // set year in footers
  var y = new Date().getFullYear();
  document.getElementById('year') && (document.getElementById('year').innerText = y);
  document.getElementById('year2') && (document.getElementById('year2').innerText = y);
  document.getElementById('year3') && (document.getElementById('year3').innerText = y);

  // simple nav toggle for mobile
  function makeToggle(id){
    var btn = document.getElementById(id);
    if(!btn) return;
    btn.addEventListener('click', function(){
      var nav = document.querySelector('.nav');
      if(nav.style.display === 'flex'){
        nav.style.display = '';
      } else {
        nav.style.display = 'flex';
        nav.style.flexDirection = 'column';
        nav.style.position = 'absolute';
        nav.style.right = '24px';
        nav.style.top = '64px';
        nav.style.background = 'rgba(10,10,10,0.95)';
        nav.style.padding = '12px';
        nav.style.borderRadius = '12px';
        nav.style.boxShadow = '0 12px 40px rgba(0,0,0,0.6)';
      }
    });
  }

  // Initialize professors slider if present on the page
  function initProfSlider(){
    var slider = document.getElementById('profSlider');
    if(!slider) return;
    var track = slider.querySelector('.slides');
    var slides = Array.prototype.slice.call(slider.querySelectorAll('.slide'));
    var prev = slider.querySelector('.slider-prev');
    var next = slider.querySelector('.slider-next');
    var dotsWrap = slider.querySelector('.slider-dots');
    if(!track || slides.length === 0) return;
    var mode = (slider.getAttribute('data-mode')||'').toLowerCase();
    var idx = 0, timer = null;
    var DUR = parseInt(slider.getAttribute('data-interval')||'',10); if(!(DUR>0)) DUR = 4000;
    function update(){
      if(mode === 'fade'){
        slides.forEach(function(s,i){ s.classList.toggle('active', i===idx); });
      } else {
        track.style.transform = 'translateX(' + (-idx*100) + '%)';
      }
      if(dotsWrap){
        dotsWrap.querySelectorAll('button').forEach(function(b,i){
          b.classList.toggle('active', i===idx);
        });
      }
    }
    function go(i){ idx = (i+slides.length)%slides.length; update(); }
    function auto(){ stop(); timer = setInterval(function(){ go(idx+1); }, DUR); }
    function stop(){ if(timer){ clearInterval(timer); timer=null; } }
    // build dots
    if(dotsWrap){
      dotsWrap.innerHTML = slides.map(function(_,i){ return '<button aria-label="Go to slide '+(i+1)+'"></button>'; }).join('');
      dotsWrap.querySelectorAll('button').forEach(function(b,i){ b.addEventListener('click', function(){ go(i); }); });
    }
    prev && prev.addEventListener('click', function(){ go(idx-1); });
    next && next.addEventListener('click', function(){ go(idx+1); });
    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', auto);
    // initial styles
    if(mode === 'fade'){
      // no width transform setup; CSS handles stacking and opacity
    } else {
      track.style.width = (slides.length*100) + '%';
      slides.forEach(function(s){ s.style.width = (100/slides.length)+'%'; });
    }
    update();
    auto();
  }
  makeToggle('navToggle');
  makeToggle('navToggle2');
  makeToggle('navToggle3');

  // active nav link highlight based on URL
  var path = window.location.pathname.split('/').pop();
  var links = document.querySelectorAll('.nav-link');
  links.forEach(function(a){
    if(a.getAttribute('href') === path || (path === '' && a.getAttribute('href') === 'index.html')){
      a.classList.add('active');
    }
  });

  // ===== Projects loader (for projects.html and project.html) =====
  function showFriendlyFetchError(targetEl) {
    if(!targetEl) return;
    targetEl.style.display = 'block';
    targetEl.innerHTML = '<strong>Note:</strong> Could not load projects.json. If you opened this file directly (file://), some browsers block fetch. Options:<br>• Open index.html via a simple local server (e.g., Python: <code>python -m http.server</code>)<br>• Or use VS Code Live Server / any static server.';
  }

  function fetchProjectsJson() {
    return fetch('assets/data/projects.json', {cache: 'no-store'})
      .then(function(r){ if(!r.ok) throw new Error('HTTP '+r.status); return r.json(); });
  }

  function getLocalProjects(){
    try { return JSON.parse(localStorage.getItem('localProjects')||'[]'); }
    catch(e){ return []; }
  }

  function getAllProjects(){
    // returns Promise resolving to merged { schema, projects }
    return fetchProjectsJson()
      .then(function(data){
        var base = (data && data.projects) || [];
        var locals = getLocalProjects();
        var map = {};
        base.forEach(function(p){ map[p.id] = p; });
        locals.forEach(function(p){ map[p.id] = p; });
        var merged = Object.keys(map).map(function(k){ return map[k]; });
        return { schema: data && data.schema, projects: merged };
      })
      .catch(function(){
        // Fallback: no JSON available (e.g., file://), but still show locals
        return { schema: null, projects: getLocalProjects() };
      });
  }

  function renderProjectsList() {
    var listEl = document.getElementById('projectsList');
    var errEl = document.getElementById('projectsError');
    var titleEl = document.getElementById('projectsTitle');
    if(!listEl) return;
    var params = new URLSearchParams(window.location.search);
    var category = params.get('category');
    var normalized = category && category.toLowerCase();
    var pretty = normalized === 'computer-science' ? 'Computer Science' : (normalized === 'architecture' ? 'Architecture' : null);
    if(titleEl && pretty){ titleEl.textContent = pretty + ' Projects'; }
    getAllProjects()
      .then(function(data){
        var items = (data && data.projects) || [];
        if(pretty){
          items = items.filter(function(p){ return (p.category || '').toLowerCase() === normalized; });
        }
        if(items.length === 0){
          listEl.innerHTML = '<div class="card">No projects yet. Add one in <code>assets/data/projects.json</code>.</div>';
          return;
        }
        listEl.innerHTML = items.map(function(p){
          var featuresCount = (p.features && p.features.length) || 0;
          return (
            '<a class="card" style="text-decoration:none;color:inherit" href="project.html?id='+ encodeURIComponent(p.id) +'">'
            + '<h3 style="margin-top:0">'+ (p.name || p.id) +'</h3>'
            + '<p class="lead">'+ (p.goal || '') +'</p>'
            + '<p style="color:#bdbdbd;margin-top:8px">Owner: '+ (p.owner || '—') +' · Features: '+ featuresCount +'</p>'
            + '</a>'
          );
        }).join('');
      })
      .catch(function(){
        showFriendlyFetchError(errEl);
      });
  }

  function renderProjectDetail() {
    var params = new URLSearchParams(window.location.search);
    var id = params.get('id');
    var titleEl = document.getElementById('projectTitle');
    var errEl = document.getElementById('projectError');
    var modifyBtn = document.getElementById('modifyBtn');
    if(!titleEl) return;
    if(!id){
      errEl.style.display = 'block';
      errEl.textContent = 'Missing project id.';
      titleEl.textContent = 'Project';
      if(modifyBtn){ modifyBtn.style.display = 'none'; }
      return;
    }
    if(modifyBtn){
      modifyBtn.href = 'add-project.html?id=' + encodeURIComponent(id) + '&edit=1';
    }
    getAllProjects()
      .then(function(data){
        var items = (data && data.projects) || [];
        var p = items.find(function(it){ return it.id === id; });
        if(!p){
          errEl.style.display = 'block';
          errEl.textContent = 'Project not found: ' + id;
          titleEl.textContent = 'Project';
          return;
        }
        titleEl.textContent = p.name || p.id;
        var goalEl = document.getElementById('goal');
        var featuresEl = document.getElementById('features');
        var fsEl = document.getElementById('fileStructure');
        var modulesTextEl = document.getElementById('modulesText');
        var moduleFunctionsEl = document.getElementById('moduleFunctions');
        var problemEl = document.getElementById('problem');
        var dataTypesEl = document.getElementById('dataTypes');
        var catBadge = document.getElementById('categoryBadge');
        var conclusionEl = document.getElementById('conclusion');

        goalEl && (goalEl.textContent = p.goal || '');

        if(featuresEl){
          featuresEl.innerHTML = (p.features || []).map(function(f){
            return '<li>'+ f +'</li>';
          }).join('');
        }

        fsEl && (fsEl.textContent = p.fileStructure || '');

        if(modulesTextEl){
          var mods = Array.isArray(p.modularArchitecture) ? p.modularArchitecture : [];
          if(mods.length === 0){
            modulesTextEl.textContent = '';
          } else {
            var sentences = mods.map(function(m){
              var parts = [];
              if(m.title){ parts.push(m.title); }
              if(m.function){ parts.push('function: ' + m.function); }
              if(m.dataTypes && m.dataTypes.length){ parts.push('data types: ' + m.dataTypes.join(', ')); }
              if(m.problemSolved){ parts.push('solves: ' + m.problemSolved); }
              return parts.join(' — ');
            });
            modulesTextEl.textContent = sentences.join('  ');
          }
        }

        if(moduleFunctionsEl){
          moduleFunctionsEl.innerHTML = (p.moduleFunctions || []).map(function(s){
            return '<li>'+ s +'</li>';
          }).join('');
        }

        problemEl && (problemEl.textContent = p.problem || '');

        if(dataTypesEl){
          dataTypesEl.innerHTML = (p.dataTypes || []).map(function(s){
            return '<li>'+ s +'</li>';
          }).join('');
        }

        if(conclusionEl){
          conclusionEl.textContent = p.conclusion || '';
        }

        if(catBadge){
          var c = (p.category || '').toLowerCase();
          var pretty = c === 'computer-science' ? 'Computer Science' : (c === 'architecture' ? 'Architecture' : '');
          catBadge.textContent = pretty;
          if(pretty){
            catBadge.style.borderColor = 'rgba(201,162,74,0.25)';
            catBadge.style.color = '#c9a24a';
          }
        }
      })
      .catch(function(){
        showFriendlyFetchError(errEl);
      });
  }

  // Route behavior by page
  if(path === 'projects.html'){
    renderProjectsList();
  } else if(path === 'project.html'){
    renderProjectDetail();
  }
  // Initialize slideshow on any page where it's present
  initProfSlider();

  // Download PDF handler on project page
  (function(){
    var pdfBtn = document.getElementById('downloadPdfBtn');
    if(pdfBtn){
      pdfBtn.addEventListener('click', function(){
        window.print();
      });
    }
  })();

  // Add-photo wiring for professors slider
  (function(){
    var btn = document.getElementById('addProfPhotoBtn');
    var input = document.getElementById('addProfPhotoInput');
    var slider = document.getElementById('profSlider');
    if(!slider || !btn || !input) return;
    function resetSlider(){
      var fresh = slider.cloneNode(true);
      slider.parentNode.replaceChild(fresh, slider);
      slider = fresh;
      // re-init slider UI
      initProfSlider();
      // rebind references on the new DOM
      btn = document.getElementById('addProfPhotoBtn');
      input = document.getElementById('addProfPhotoInput');
      wire();
    }
    function wire(){
      btn && btn.addEventListener('click', function(){ input && input.click(); });
      input && input.addEventListener('change', function(){
        var file = input.files && input.files[0];
        if(!file) return;
        var reader = new FileReader();
        reader.onload = function(e){
          var url = e.target && e.target.result;
          if(!url) return;
          var track = slider.querySelector('.slides');
          if(!track) return;
          var slide = document.createElement('div');
          slide.className = 'slide';
          var img = document.createElement('img');
          img.className = 'portrait';
          img.alt = 'Professor Photo';
          img.src = url;
          slide.appendChild(img);
          track.appendChild(slide);
          resetSlider();
        };
        reader.readAsDataURL(file);
        input.value = '';
      });
    }
    wire();
  })();
});
