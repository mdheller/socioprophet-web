<template>
  <div>
    <header class='topbar'>
      <div class='brand'>SocioProphet</div>
      <nav class='nav'>
        <RouterLink to='/dashboard'>Dash</RouterLink>
        <RouterLink to='/builder'>Builder</RouterLink>
        <RouterLink to='/entities'>Entities</RouterLink>
        <RouterLink to='/layouts'>Layouts</RouterLink>
        <RouterLink to='/specs'>Specs</RouterLink>
        <RouterLink to='/terminal'>Terminal</RouterLink>
        <RouterLink to='/settings'>Settings</RouterLink>
        <RouterLink to='/research'>Research</RouterLink>
        <RouterLink to='/reader'>Reader</RouterLink>
        <RouterLink to='/code'>Code</RouterLink>
        <RouterLink to='/stories'>Stories</RouterLink>
        <RouterLink to='/journal'>Journal</RouterLink>
        <RouterLink to='/experiments'>Experiments</RouterLink>
        <RouterLink to='/runs'>Runs</RouterLink>
        <RouterLink to='/policies'>Policies</RouterLink>
        <RouterLink to='/datasets'>Datasets</RouterLink>
        <RouterLink to='/gates'>Gates</RouterLink>
        <RouterLink to='/attestations'>Attestations</RouterLink>
        <RouterLink to='/credentials'>Credentials</RouterLink>
        <RouterLink to='/filters'>Filters</RouterLink>
        <RouterLink to='/compliance'>Compliance</RouterLink>
        <RouterLink to='/console'>Console</RouterLink>
      </nav>
    </header>
    <main>
      <RouterView />
    </main>
  </div>
</template>
<script setup lang='ts'></script>
