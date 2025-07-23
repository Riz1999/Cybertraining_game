const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = function override(config, env) {
  const isProduction = env === 'production';

  // Add compression plugin for production builds
  if (isProduction) {
    // Add Gzip compression
    config.plugins.push(
      new CompressionPlugin({
        algorithm: 'gzip',
        test: /\.(js|css|html|svg)$/,
        threshold: 10240, // Only compress assets > 10kb
        minRatio: 0.8, // Only compress assets that compress well
      })
    );

    // Add Brotli compression if available
    try {
      const zlib = require('zlib');
      if (zlib.brotliCompress) {
        config.plugins.push(
          new CompressionPlugin({
            filename: '[path][base].br',
            algorithm: 'brotliCompress',
            test: /\.(js|css|html|svg)$/,
            threshold: 10240,
            minRatio: 0.8,
            compressionOptions: {
              level: 11,
            },
          })
        );
      }
    } catch (e) {
      console.log('Brotli compression not available');
    }

    // Optimize images
    config.module.rules.push({
      test: /\.(jpe?g|png|gif)$/i,
      type: 'asset',
      parser: {
        dataUrlCondition: {
          maxSize: 10 * 1024, // 10kb
        },
      },
    });

    // Add image optimization
    config.optimization.minimizer.push(
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              ['gifsicle', { interlaced: true }],
              ['jpegtran', { progressive: true }],
              ['optipng', { optimizationLevel: 5 }],
              ['svgo', { plugins: [{ removeViewBox: false }] }],
            ],
          },
        },
      })
    );

    // Enhance JS and CSS optimization
    config.optimization.minimizer.push(
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
          },
          output: {
            comments: false,
          },
        },
        extractComments: false,
      }),
      new CssMinimizerPlugin()
    );

    // Generate asset manifest for caching
    config.plugins.push(
      new WebpackManifestPlugin({
        fileName: 'asset-manifest.json',
        publicPath: '/',
        generate: (seed, files, entrypoints) => {
          const manifestFiles = files.reduce((manifest, file) => {
            manifest[file.name] = file.path;
            return manifest;
          }, seed);
          const entrypointFiles = entrypoints.main.filter(
            (fileName) => !fileName.endsWith('.map')
          );

          return {
            files: manifestFiles,
            entrypoints: entrypointFiles,
          };
        },
      })
    );

    // Configure Workbox for service worker
    config.plugins.push(
      new WorkboxPlugin.InjectManifest({
        swSrc: path.resolve(__dirname, 'public/service-worker.js'),
        swDest: 'service-worker.js',
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
      })
    );
  }

  // Split chunks for better caching
  config.optimization.splitChunks = {
    chunks: 'all',
    name: false,
    cacheGroups: {
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        chunks: 'all',
      },
      common: {
        name: 'common',
        minChunks: 2,
        chunks: 'async',
        priority: 10,
        reuseExistingChunk: true,
        enforce: true,
      },
    },
  };

  return config;
};const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = function override(config, env) {
  const isProduction = env === 'production';

  // Add compression plugin for production builds
  if (isProduction) {
    // Add Gzip compression
    config.plugins.push(
      new CompressionPlugin({
        algorithm: 'gzip',
        test: /\.(js|css|html|svg)$/,
        threshold: 10240, // Only compress assets > 10kb
        minRatio: 0.8, // Only compress assets that compress well
      })
    );

    // Add Brotli compression if available
    try {
      const zlib = require('zlib');
      if (zlib.brotliCompress) {
        config.plugins.push(
          new CompressionPlugin({
            filename: '[path][base].br',
            algorithm: 'brotliCompress',
            test: /\.(js|css|html|svg)$/,
            threshold: 10240,
            minRatio: 0.8,
            compressionOptions: {
              level: 11,
            },
          })
        );
      }
    } catch (e) {
      console.log('Brotli compression not available');
    }

    // Optimize images
    config.module.rules.push({
      test: /\.(jpe?g|png|gif)$/i,
      type: 'asset',
      parser: {
        dataUrlCondition: {
          maxSize: 10 * 1024, // 10kb
        },
      },
    });

    // Add image optimization
    config.optimization.minimizer.push(
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              ['gifsicle', { interlaced: true }],
              ['jpegtran', { progressive: true }],
              ['optipng', { optimizationLevel: 5 }],
              ['svgo', { plugins: [{ removeViewBox: false }] }],
            ],
          },
        },
      })
    );

    // Enhance JS and CSS optimization
    config.optimization.minimizer.push(
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
          },
          output: {
            comments: false,
          },
        },
        extractComments: false,
      }),
      new CssMinimizerPlugin()
    );

    // Generate asset manifest for caching
    config.plugins.push(
      new WebpackManifestPlugin({
        fileName: 'asset-manifest.json',
        publicPath: '/',
        generate: (seed, files, entrypoints) => {
          const manifestFiles = files.reduce((manifest, file) => {
            manifest[file.name] = file.path;
            return manifest;
          }, seed);
          const entrypointFiles = entrypoints.main.filter(
            (fileName) => !fileName.endsWith('.map')
          );

          return {
            files: manifestFiles,
            entrypoints: entrypointFiles,
          };
        },
      })
    );

    // Configure Workbox for service worker
    config.plugins.push(
      new WorkboxPlugin.InjectManifest({
        swSrc: path.resolve(__dirname, 'public/service-worker.js'),
        swDest: 'service-worker.js',
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
      })
    );
  }

  // Split chunks for better caching
  config.optimization.splitChunks = {
    chunks: 'all',
    name: false,
    cacheGroups: {
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        chunks: 'all',
      },
      common: {
        name: 'common',
        minChunks: 2,
        chunks: 'async',
        priority: 10,
        reuseExistingChunk: true,
        enforce: true,
      },
    },
  };

  return config;
};