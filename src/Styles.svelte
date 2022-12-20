// This is how we build our own bootstrap theme in the scss directory

<style global lang="scss">
  // Functions first
  @import "../node_modules/bootstrap-scss/functions";

  // Variable overrides second
  @import "./scss/color";
  @import "./scss/block";
  @import "./scss/navbar";
  @import "./scss/typography";
  @import "./scss/season";
  // $prefix "wado-"
  $enable-shadows: true;
  .adonai {
    font-variant: small-caps;
  }

  // Required Bootstrap imports
  @import "../node_modules/bootstrap-scss/variables";
  @import "../node_modules/bootstrap-scss/maps";
  @import "../node_modules/bootstrap-scss/mixins";
  @import "../node_modules/bootstrap-scss/root";

  // Optional components
  @import "../node_modules/bootstrap-scss/utilities";
  @import "../node_modules/bootstrap-scss/reboot";
  @import "../node_modules/bootstrap-scss/containers";
  @import "../node_modules/bootstrap-scss/grid";
  @import "../node_modules/bootstrap-scss/helpers";
  @import "../node_modules/bootstrap-scss/utilities/api";
  @import "../node_modules/bootstrap-scss/card";
  @import "../node_modules/bootstrap-scss/nav";
  @import "../node_modules/bootstrap-scss/navbar";
  @import "../node_modules/bootstrap-scss/forms";
  @import "../node_modules/bootstrap-scss/buttons";
  @import "../node_modules/bootstrap-scss/modal";
  @import "../node_modules/bootstrap-scss/close";
  @import "../node_modules/bootstrap-scss/dropdown";
  @import "../node_modules/bootstrap-scss/spinners";
  @import "../node_modules/bootstrap-scss/tables";
  @import "../node_modules/bootstrap-scss/list-group";
</style>
