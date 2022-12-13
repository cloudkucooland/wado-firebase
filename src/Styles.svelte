// This is how we build our own bootstrap theme in the scss directory

<style global lang="scss">
  // Functions first
  @import "../node_modules/bootstrap-scss/functions";

  // Variable overrides second
  @import "./scss/color";
  @import "./scss/block";
  @import "./scss/card";
  $enable-shadows: true;

  // Required Bootstrap imports
  @import "../node_modules/bootstrap-scss/variables";
  @import "../node_modules/bootstrap-scss/mixins";
  @import "../node_modules/bootstrap-scss/root";
  html,
  body {
    height: 100%;
    font-weight: normal;
  }
  body {
    display: flex;
    flex-direction: column;
  }
  a:hover {
    text-decoration: none;
  }
  .navbar {
    padding-right: 10px !important;
    padding-left: 10px !important;
    padding-top: 0px !important;
    padding-bottom: 0px !important;
  }
  .navbar a {
    font-weight: 700;
    border-bottom: 1px solid transparent;
  }
  .navbar a:hover {
    border-bottom: 1px solid #a30e15ff;
  }
  .content-area {
    padding: 0 16px 16px 16px;
  }
  .card {
    margin-top: 20px;
  }
  .card-header {
    font-size: 150%;
    font-weight: 700;
  }
  footer {
    font-size: 80%;
    font-weight: 500;
  }

  // Optional components
  @import "../node_modules/bootstrap-scss/utilities";
  @import "../node_modules/bootstrap-scss/reboot";
  @import "../node_modules/bootstrap-scss/containers";
  @import "../node_modules/bootstrap-scss/grid";
  @import "../node_modules/bootstrap-scss/helpers";
  @import "../node_modules/bootstrap-scss/utilities/api";
  @import "../node_modules/bootstrap-scss/nav";
  @import "../node_modules/bootstrap-scss/navbar";
  @import "../node_modules/bootstrap-scss/forms";
  @import "../node_modules/bootstrap-scss/buttons";
  @import "../node_modules/bootstrap-scss/modal";
  @import "../node_modules/bootstrap-scss/close";
  @import "../node_modules/bootstrap-scss/dropdown";
  @import "../node_modules/bootstrap-scss/spinners";
  @import "../node_modules/bootstrap-scss/tables";
</style>
