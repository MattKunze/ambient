{ pkgs, lib, config, inputs, ... }:

let
  # need unstable to get bun 1.3 at the moment
  pkgs-unstable = import inputs.nixpkgs-unstable { system = pkgs.stdenv.system; };
in
{
  packages = [
    # pkgs-unstable.bun
    pkgs.just
    pkgs.mqttui
    pkgs.ncftp
  ];

  languages.javascript = {
    enable = true;
    npm.enable = true;
    bun.enable = true;
    bun.package = pkgs-unstable.bun;
    # bun.install.enable = true;
  };
}
